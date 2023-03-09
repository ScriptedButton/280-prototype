import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function updateBallot(ballotId: string, data: any) {
    return await prisma.ballot.update({
        where: {
            id: ballotId
        },
        data: data
    })
}

export async function addIssue(data: any) {
    const ballotData = await prisma.ballot.create({
        data: {
            name: data.name,
        }
    })
}

export async function setBallotStatus(ballotId: string, state: boolean) {
    const ballotData = await prisma.ballot.update({
        where: {
            id: ballotId
        },
        data: {
            active: state
        }
    })


    return ballotData;
}

export async function getBallots() {
    const ballotData = await prisma.ballot.findMany()

    return ballotData;
}

export async function getBallot(ballotId: string) {

    const ballotData = await prisma.ballot.findFirst(
        {
            where: {
                id: ballotId
            }
        }
    )

    return ballotData;
}

export async function getActiveBallot() {

    return await prisma.ballot.findFirst(
        {
            where: {
                active: true
            }
        }
    );
}

export async function getBallotIssues(ballotId: string) {
    const ballotData = await prisma.issue.findMany(
        {
            where: {
                Ballot: {
                    id: ballotId,
                },
            },
            include: {
                options: {
                    include: {
                        votes: true
                    }
                }
            }
        }
    )

    return ballotData;
}

export async function addBallot(data: any) {

    const ballotData = await prisma.ballot.create({
        data: {
            name: data.name,
        }
    })

    return ballotData;
}

export async function deleteBallot(ballotId: string) {

    const ballotData = await prisma.ballot.delete({
        where: {
            id: ballotId
        }
    })

    return ballotData;
}

export async function getActiveBallotIssues() {
    const ballotData = await prisma.issue.findMany(
        {
            where: {
                Ballot: {
                    active: true
                },
            },
            include: {
                options: {
                    include: {
                        votes: true
                    }
                }
            }
        }
    )

    return ballotData;
}

export async function validateLogin(username: string, password: string) {
    const userData = await prisma.user.findFirst({
        where: {
            username: username,
            password: password
        }
    })

    return userData;
}

export async function addVote(data: any) {

    const voteData = await prisma.vote.create({
        data: {
            ballotId: data.ballotId,
            issueId: data.issueId,
            optionId: data.optionId,
            userId: data.userId
        }
    })

    await prisma.issue.update({
        where: {
            id: data.issueId
        },
        data: {
            votes: {
                connect: {
                    id: voteData.id
                }
            }
        }
    })

    return voteData;
}

export async function hasVoted(userId: string, ballotId: string) {
    return await prisma.vote.findFirst({
        where: {
            userId: userId,
            ballotId: ballotId
        }
    });
}

export async function createOption(data: any) {
    return await prisma.option.create({
        data: {
            name: data.name,
            issueId: data.issueId
        },
    })
}

export async function getUserVoteSummary(userId: string, ballotId: string) {
    return await prisma.vote.findMany({
        where: {
            userId: userId,
            ballotId: ballotId
        },
        include: {
            option: true,
            issue: true
        }
    })
}
