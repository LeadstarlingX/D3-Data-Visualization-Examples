// Homework: Dynamic Teams Board

const leaderboard = d3.select('#leaderboard');

// Initial teams data
let teams = [
    { name: 'Real Madrid', points: 45, goalsFor: 40, goalsAgainst: 15 },
    { name: 'Manchester City', points: 42, goalsFor: 45, goalsAgainst: 18 },
    { name: 'Bayern Munich', points: 40, goalsFor: 38, goalsAgainst: 12 },
    { name: 'Liverpool', points: 38, goalsFor: 35, goalsAgainst: 20 },
    { name: 'Paris Saint-Germain', points: 35, goalsFor: 30, goalsAgainst: 22 },
    { name: 'Arsenal', points: 33, goalsFor: 32, goalsAgainst: 19 },
    { name: 'Inter Milan', points: 30, goalsFor: 28, goalsAgainst: 21 }
];

// Potential new teams pool
const potentialTeams = [
    'Barcelona', 'AC Milan', 'Borussia Dortmund', 'Napoli', 'Atletico Madrid',
    'Bayer Leverkusen', 'Juventus', 'Chelsea', 'Tottenham', 'Porto'
];

// Function to update the board
function updateBoard(data) {
    // 1. Sort data by points descending, then goal difference
    data.sort((a, b) => {
        const gdA = a.goalsFor - a.goalsAgainst;
        const gdB = b.goalsFor - b.goalsAgainst;
        if (b.points !== a.points) return b.points - a.points;
        return gdB - gdA;
    });

    // 2. Use selectAll.data().join() for enter-update-exit
    const teamSelection = leaderboard
        .selectAll('.team')
        .data(data, d => d.name);

    teamSelection.join(
        enter => {
            const teamDiv = enter.append('div')
                .attr('class', 'team entering')
                .style('opacity', 0)
                .style('transform', 'translateX(-20px)');

            teamDiv.each(function (d) {
                const index = data.findIndex(t => t.name === d.name);
                d3.select(this).style('top', `${index * rowHeight}px`);
            });

            teamDiv.append('div').attr('class', 'position');
            teamDiv.append('div').attr('class', 'name');
            teamDiv.append('div').attr('class', 'points');
            teamDiv.append('div').attr('class', 'gd');

            teamDiv.transition()
                .duration(1000)
                .style('opacity', 1)
                .style('transform', 'translateX(0)')
                .on('end', function () {
                    d3.select(this).classed('entering', false);
                });

            return teamDiv;
        },
        update => {
            update.classed('updating', true)
                .transition()
                .duration(1000)
                .on('end', function () {
                    d3.select(this).classed('updating', false);
                });
            return update;
        },
        exit => {
            exit.classed('exiting', true)
                .transition()
                .duration(1000)
                .style('opacity', 0)
                .style('transform', 'translateX(20px)')
                .remove();
        }
    );

    // 3. Update all teams (including newly entered ones)
    const rowHeight = 50;

    leaderboard.selectAll('.team').each(function (d, i) {
        const team = d3.select(this);
        const index = data.findIndex(t => t.name === d.name);

        // If the team is not in the current data (exiting), it will be handled by exit
        if (index === -1) return;

        const gd = d.goalsFor - d.goalsAgainst;
        team.select('.position').text(index + 1);
        team.select('.name').text(d.name);
        team.select('.points').text(d.points);
        team.select('.gd').text(gd > 0 ? `+${gd}` : gd);

        // Animate position
        team.transition()
            .duration(1000)
            .style('top', `${index * rowHeight}px`);
    });

    // Adjust leaderboard container height
    leaderboard.style('height', `${data.length * rowHeight}px`);

    console.log('Board updated with data:', data);
}

// Function to simulate data changes
function updateData() {
    // 1. Update points/goals for existing teams
    teams.forEach(team => {
        if (Math.random() > 0.5) {
            const goals = Math.floor(Math.random() * 3);
            team.points += Math.random() > 0.7 ? 3 : (Math.random() > 0.4 ? 1 : 0);
            team.goalsFor += goals;
            team.goalsAgainst += Math.floor(Math.random() * 2);
        }
    });

    // 2. Occasionally add a new team
    if (Math.random() > 0.7 && potentialTeams.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialTeams.length);
        const newTeamName = potentialTeams.splice(randomIndex, 1)[0];
        teams.push({
            name: newTeamName,
            points: Math.min(...teams.map(t => t.points)) + Math.floor(Math.random() * 5),
            goalsFor: Math.floor(Math.random() * 10),
            goalsAgainst: Math.floor(Math.random() * 10)
        });
        console.log(`Added team: ${newTeamName}`);
    }

    // 3. Occasionally remove a team
    if (Math.random() > 0.8 && teams.length > 6) {
        const randomIndex = Math.floor(Math.random() * teams.length);
        const removedTeam = teams.splice(randomIndex, 1)[0];
        potentialTeams.push(removedTeam.name);
        console.log(`Removed team: ${removedTeam.name}`);
    }

    updateBoard(teams);
}

// Initial call
updateBoard(teams);

// Set interval to update data every 2.5 seconds
setInterval(updateData, 2500);