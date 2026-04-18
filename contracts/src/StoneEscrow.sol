// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StoneEscrow {
    struct Milestone {
        string title;
        uint256 amount;
        bool approved;
        bool paid;
    }

    struct Job {
        uint256 id;
        address client;
        address freelancer;
        string title;
        string description;
        uint256 totalAmount;
        uint256 fundedAmount;
        uint256 createdAt;
        bool exists;
        uint256 milestoneCount;
    }

    uint256 public jobCounter;

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Milestone[]) private jobMilestones;

    event JobCreated(uint256 indexed jobId, address indexed client, address indexed freelancer, uint256 totalAmount);
    event FundsDeposited(uint256 indexed jobId, address indexed client, uint256 amount);
    event MilestoneApproved(uint256 indexed jobId, uint256 indexed milestoneIndex);
    event MilestonePaid(uint256 indexed jobId, uint256 indexed milestoneIndex, address indexed freelancer, uint256 amount);

    modifier onlyExistingJob(uint256 jobId) {
        require(jobs[jobId].exists, "Job does not exist");
        _;
    }

    modifier onlyClient(uint256 jobId) {
        require(msg.sender == jobs[jobId].client, "Only client can call this");
        _;
    }

    function createJob(
        address freelancer,
        string calldata title,
        string calldata description,
        string[] calldata milestoneTitles,
        uint256[] calldata milestoneAmounts
    ) external returns (uint256 jobId) {
        require(freelancer != address(0), "Invalid freelancer");
        require(milestoneTitles.length == milestoneAmounts.length, "Milestones length mismatch");
        require(milestoneTitles.length > 0, "At least one milestone required");

        uint256 totalAmount;
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            require(milestoneAmounts[i] > 0, "Milestone amount must be > 0");
            totalAmount += milestoneAmounts[i];
        }

        jobId = ++jobCounter;

        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: freelancer,
            title: title,
            description: description,
            totalAmount: totalAmount,
            fundedAmount: 0,
            createdAt: block.timestamp,
            exists: true,
            milestoneCount: milestoneTitles.length
        });

        for (uint256 i = 0; i < milestoneTitles.length; i++) {
            jobMilestones[jobId].push(
                Milestone({
                    title: milestoneTitles[i],
                    amount: milestoneAmounts[i],
                    approved: false,
                    paid: false
                })
            );
        }

        emit JobCreated(jobId, msg.sender, freelancer, totalAmount);
    }

    function depositFunds(uint256 jobId) external payable onlyExistingJob(jobId) onlyClient(jobId) {
        require(msg.value > 0, "Deposit must be > 0");
        jobs[jobId].fundedAmount += msg.value;
        emit FundsDeposited(jobId, msg.sender, msg.value);
    }

    function approveAndPayMilestone(uint256 jobId, uint256 milestoneIndex)
        external
        onlyExistingJob(jobId)
        onlyClient(jobId)
    {
        require(milestoneIndex < jobMilestones[jobId].length, "Invalid milestone index");

        Milestone storage milestone = jobMilestones[jobId][milestoneIndex];
        require(!milestone.paid, "Milestone already paid");
        require(jobs[jobId].fundedAmount >= milestone.amount, "Insufficient escrow funds");

        milestone.approved = true;
        milestone.paid = true;
        jobs[jobId].fundedAmount -= milestone.amount;

        emit MilestoneApproved(jobId, milestoneIndex);

        (bool success, ) = payable(jobs[jobId].freelancer).call{value: milestone.amount}("");
        require(success, "Transfer failed");

        emit MilestonePaid(jobId, milestoneIndex, jobs[jobId].freelancer, milestone.amount);
    }

    function getJob(uint256 jobId) external view onlyExistingJob(jobId) returns (Job memory) {
        return jobs[jobId];
    }

    function getMilestones(uint256 jobId) external view onlyExistingJob(jobId) returns (Milestone[] memory) {
        return jobMilestones[jobId];
    }

    function getJobProgress(uint256 jobId)
        external
        view
        onlyExistingJob(jobId)
        returns (uint256 totalMilestones, uint256 paidMilestones, uint256 totalPaid, uint256 remainingEscrow)
    {
        totalMilestones = jobMilestones[jobId].length;
        remainingEscrow = jobs[jobId].fundedAmount;

        for (uint256 i = 0; i < totalMilestones; i++) {
            if (jobMilestones[jobId][i].paid) {
                paidMilestones++;
                totalPaid += jobMilestones[jobId][i].amount;
            }
        }
    }
}
