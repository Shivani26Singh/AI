Design document
1. Project Overview
This Rovo solution is intended to generate an automated sprint summary for an individual engineer/QA.
The goal is to produce the same report that a team member would manually prepare before sprint stand-up or sprint review.
The report must combine information from multiple Jira sources:
•	Active Sprint
•	Previous Sprint
•	Original Estimates
•	Worklogs
•	Sprint Membership
•	Historical Status
•	Changelog
•	Current Assignments
The report must represent the individual user's work, not the team's backlog.
________________________________________
2. Desired Final Report Example
OHPF Sprint: 24 June – 7 July

Tasks planned: 8d 2h

Current Sprint Commitments:
https://hptech.atlassian.net/browse/MDA-2043
https://hptech.atlassian.net/browse/MDA-2044
https://hptech.atlassian.net/browse/MDA-2046
https://hptech.atlassian.net/browse/MDA-2047
https://hptech.atlassian.net/browse/MDA-2163

Previous Sprint Status:
Time Logged - 8d 7h 15m
Tasks Status:
https://hptech.atlassian.net/browse/MDA-1970 - Done
https://hptech.atlassian.net/browse/MDA-2017 - Done
https://hptech.atlassian.net/browse/MDA-2018 - Done
https://hptech.atlassian.net/browse/MDA-2011 - Done
https://hptech.atlassian.net/browse/MDA-2012 - Done
https://hptech.atlassian.net/browse/MDA-2087 - Done
https://hptech.atlassian.net/browse/DATA-1611 - Done (Pulled midway during sprint
)
https://hptech.atlassian.net/browse/MDA-1580 - Done (Pulled midway during sprint
)
https://hptech.atlassian.net/browse/IP-1128 - Done (Pulled midway during sprint
)
https://hptech.atlassian.net/browse/MDA-2043 - In Progress
https://hptech.atlassian.net/browse/MDA-2044 - Ready
________________________________________
Current Architecture
The solution currently contains one master agent and four subagents.
________________________________________
Master Agent
Sprint Summary Generator
Responsibility
This agent does not query Jira.
It only orchestrates the subagents.
It combines the returned outputs into one final report.
It should never calculate anything itself.
________________________________________
Subagent 1
Current Sprint Commitments
Purpose
Determine the user's personal sprint commitment.
It should return only the Jira issues that represent the user's remaining work for the active sprint.
Input
•	User Name
•	Sprint Start Date
•	Sprint End Date
Output
Current Sprint Commitments

https://...
https://...
Responsibilities
•	Find the active sprint
•	Determine which issues belong to the user's current commitment
•	Ignore completed work from previous sprints
•	Ignore parent stories that remain open because of other assignees
•	Include work completed during the current sprint
•	Return URLs only
________________________________________
Subagent 2
Current Sprint Planned Effort
Purpose
Calculate the planned effort corresponding to the exact issues returned by Current Sprint Commitments.
Input
•	User Name
•	Sprint Start Date
•	Sprint End Date
Output
Tasks planned: 8d 2h
Responsibilities
•	Retrieve Original Estimate
•	Convert estimates to hours
•	Sum estimates
•	Return one total
•	Use the exact same issue set as Current Sprint Commitments
________________________________________
Subagent 3
Sprint Time Reporter
Purpose
Calculate the actual hours worked during the previous sprint.
Input
•	User Name
•	Start Date
•	End Date
Output
Previous Sprint: Time Logged - 8d 7h 15m
Responsibilities
•	Read Jira worklogs
•	Sum worklogs
•	Convert hours to days
•	Return only the final total
The worklog list is used internally for validation and should not appear in the final report.
________________________________________
Subagent 4
Previous Sprint Achievement
Purpose
Produce the user's previous sprint outcome.
Input
•	User Name
•	Previous Sprint Start Date
•	Previous Sprint End Date
•	Previous Sprint Commitment List
Output
Done

...

Pulled midway during sprint

...

In Progress

...

Not Started

...
Responsibilities
•	Compare planned vs actual
•	Use historical status as of sprint end
•	Determine Done
•	Determine In Progress
•	Determine Not Started
•	Identify work pulled into the sprint after planning
•	Never use today's status
________________________________________
Important Business Rules
The report is personal, not team-based.
If another developer keeps a story open, my completed sub-task should not appear in my current sprint commitment.
Historical reports must represent the state at the end of the previous sprint, not today's Jira state.
Worklogs determine Time Logged.
Original Estimates determine Planned Effort.
Current Sprint Commitments determine which issues Planned Effort should include.
The master agent should never calculate or modify values returned by subagents.
________________________________________
Current Problems
The existing implementation has several inconsistent behaviors:
1.	Current Sprint Commitments sometimes includes issues that belong to my previous sprint.
2.	Planned Effort sometimes includes estimates from parent stories or completed sub-tasks.
3.	Previous Sprint Achievement sometimes uses today's Jira status instead of the status at the previous sprint end date.
4.	Sprint Time Reporter occasionally duplicates worklogs or returns inconsistent totals.
5.	The master agent sometimes reformats subagent output, inserts "Subagent Response", or changes URLs into Markdown.
6.	Mid-sprint reporting is unreliable because issue status and sprint membership change during the sprint.
________________________________________
What I Need
I need a redesigned Rovo solution that produces deterministic results.
Please review the current architecture and determine:
1.	Whether the agent responsibilities should be redesigned.
2.	Whether additional subagents are required.
3.	Whether the current prompts contain conflicting rules.
4.	Whether Rovo Skills or JQL limitations require a different architecture.
5.	The complete set of triggers, instructions, and validation rules needed to reliably generate the expected report.

