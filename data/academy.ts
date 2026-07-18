import { demoConfig } from '@/config/demo';
import { getLessonById, learningLessons } from '@/data/learning';
import { latestAssessmentId, progressFeedbackDetails } from '@/data/progress-details';
import { progressDashboardMock } from '@/data/progress';
import { AcademyPlayer, AgeCategory, AttendanceMark, DominantFoot, PlayerPosition, SharedAcademyData } from '@/types/academy';
import { LearningLesson } from '@/types/learning';

const namesByCategory: Readonly<Record<AgeCategory, readonly string[]>> = {
  U10: ['Nihal K.', 'Mohammed Rishan', 'Vishnu Prasad', 'Favas P.', 'Dev Anand', 'Rohan Joseph', 'Adwaith Krishna', 'Hisham N.', 'Joel Mathew', 'Sidharth Menon', 'Aravind R.', 'Akhil Dev', 'Jishnu P.', 'Amal Raj', 'Neeraj Vinod', 'Shawn Thomas', 'Mishal Kareem', 'Hari Govind', 'Noel James', 'Aarav B.'],
  U13: ['Ayaan Mohammed', 'Farhan Ali', 'Rizwan P.', 'Adil Rahman', 'Zayan Ashraf', 'Arjun Raj', 'Salman Faris', 'Nived Krishnan', 'Rayyan Latheef', 'Ajmal Shafi', 'Abhinav S.', 'Irfan Niyas', 'Shamil Basheer', 'Yaseen Mohammed', 'Hanan Shafi', 'Aaron Mathew', 'Gokul Das', 'Fahad N.', 'Sameer P.', 'Mazin A.'],
  U15: ['Riyas K.', 'Vivek Prasad', 'Ashwin Raj', 'Mohammed Zidan', 'Jeron Paul', 'Adarsh Menon', 'Fasil Rahman', 'Kiran Dev', 'Shane Joseph', 'Suhail P.', 'Anand Krishna', 'Navas Ali', 'Akhil Raj', 'Christy Thomas', 'Nabeel Shafi', 'Rohit Vinod', 'Junaid K.', 'Amaljith S.', 'Ishan Mohammed', 'Kevin Mathew'],
};

const positions: readonly PlayerPosition[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Forward'];
const feet: readonly DominantFoot[] = ['Right', 'Right', 'Left', 'Right', 'Both'];
const sessionStatuses: readonly AttendanceMark[] = [...Array.from({ length: 16 }, () => 'present' as const), 'absent', 'absent', 'late', 'not-marked'];
const goals = ['First touch', 'Passing under pressure', 'Ball control', 'Positioning', 'Stamina', 'Finishing'] as const;
const lessonIds = ['ball-control-basics', 'passing-under-pressure', 'dynamic-warm-up-routine', 'understanding-player-positioning'] as const;

function jerseyForIndex(index: number, category: AgeCategory) {
  if (category === 'U13' && index === 0) return demoConfig.player.jerseyNumber;
  const sequential = index + 1;
  return category === 'U13' && sequential >= demoConfig.player.jerseyNumber ? sequential + 1 : sequential;
}

function buildPlayer(name: string, index: number, category: AgeCategory): AcademyPlayer {
  const isAyaan = category === 'U13' && index === 0;
  const playerKey = isAyaan ? 'player-ayaan' : `player-${category.toLowerCase()}-${String(index + 1).padStart(2, '0')}`;
  const attendancePercentage = isAyaan ? demoConfig.player.attendancePercent : 82 + ((index * 3 + Number(category.slice(1))) % 17);
  const rating = isAyaan ? demoConfig.player.coachRating : Number((3.5 + ((index * 2) % 12) / 10).toFixed(1));
  const focus = isAyaan ? demoConfig.player.currentGoal : goals[index % goals.length];
  const assignedLessonIds = isAyaan ? ['weak-foot-passing-drill'] : [lessonIds[index % lessonIds.length]];
  const skills = isAyaan
    ? [...progressDashboardMock.skillRatings.slice(0, 4).map((skill) => ({ key: skill.key, label: skill.label, rating: skill.rating })), { key: 'stamina', label: 'Stamina', rating: 4.0 }, { key: 'teamwork', label: 'Teamwork', rating: 4.2 }]
    : ['First touch', 'Passing', 'Dribbling', 'Pace', 'Stamina', 'Teamwork'].map((label, skillIndex) => ({ key: label.toLowerCase().replace(/\s/g, '-'), label, rating: Number(Math.min(5, Math.max(2.5, rating + ((skillIndex % 3) - 1) * 0.2)).toFixed(1)) }));
  return {
    id: playerKey,
    playerId: isAyaan ? demoConfig.player.playerId : `GCC-${category}-${String(index + 1).padStart(3, '0')}`,
    name,
    category,
    squadId: category.toLowerCase(),
    jerseyNumber: jerseyForIndex(index, category),
    dateOfBirth: `${String(4 + (index % 23)).padStart(2, '0')} ${['January', 'March', 'May', 'August', 'November'][index % 5]} ${category === 'U10' ? 2016 : category === 'U13' ? 2013 : 2011}`,
    age: category === 'U10' ? 10 : category === 'U13' ? 13 : 15,
    position: isAyaan ? 'Midfielder' : positions[index % positions.length],
    dominantFoot: feet[index % feet.length],
    joiningDate: `${String(5 + (index % 20)).padStart(2, '0')} ${['January', 'June', 'September'][index % 3]} ${2022 + (index % 4)}`,
    avatar: null,
    attendance: { percentage: attendancePercentage, present: isAyaan ? 15 : 13 + (index % 4), absent: isAyaan ? 1 : index % 3, late: isAyaan ? 1 : index % 2, currentStatus: sessionStatuses[index], lastAttendanceDate: demoConfig.timeline.latestAssessmentDate },
    latestRating: rating,
    focus,
    goalTarget: isAyaan ? '100 weak-foot passes' : `Improve ${focus.toLowerCase()} consistency`,
    goalProgress: isAyaan ? 64 : 35 + ((index * 7) % 55),
    coachNote: isAyaan ? 'Complete three sets of controlled weak-foot passes before the next training session.' : `Keep practising ${focus.toLowerCase()} with control and good technique.`,
    sessionStatus: sessionStatuses[index],
    latestAssessmentId: isAyaan ? latestAssessmentId : `assessment-${playerKey}`,
    latestFeedbackId: isAyaan ? 'feedback-jul' : `feedback-${playerKey}`,
    assignedLessonIds,
    membershipStatus: index === 18 ? 'pending-renewal' : 'active',
    skills,
  };
}

const academyPlayers = (Object.keys(namesByCategory) as AgeCategory[]).flatMap((category) => namesByCategory[category].map((name, index) => buildPlayer(name, index, category)));
const latestFeedback = academyPlayers.map((player) => {
  const ayaanFeedback = player.id === 'player-ayaan' ? progressFeedbackDetails[0] : undefined;
  return { id: player.latestFeedbackId ?? `feedback-${player.id}`, playerId: player.id, playerName: player.name, coachId: 'coach-sandeep', focus: ayaanFeedback?.focus ?? player.focus, updatedAt: 'Updated today', date: ayaanFeedback?.date ?? demoConfig.timeline.latestAssessmentDate, comment: ayaanFeedback?.message ?? `Good effort in training. Keep working on ${player.focus.toLowerCase()}.` };
});
const historicalFeedback = academyPlayers.flatMap((player, playerIndex) => {
  if (player.id === 'player-ayaan') return progressFeedbackDetails.slice(1).map((feedback) => ({ id: feedback.id, playerId: player.id, playerName: player.name, coachId: 'coach-sandeep', focus: feedback.focus, updatedAt: `Updated ${feedback.date.replace(' 2026', '')}`, date: feedback.date, comment: feedback.message }));
  return [{ id: `feedback-${player.id}-previous`, playerId: player.id, playerName: player.name, coachId: 'coach-sandeep', focus: player.skills[(playerIndex + 1) % player.skills.length].label, updatedAt: 'Updated 24 June', date: '24 June 2026', comment: 'Positive attitude and improved decision-making during small-sided games.' }];
});

export const sharedAcademyData: SharedAcademyData = {
  academy: { id: 'gcc-chalissery', name: 'GCC Chalissery Football Academy', shortName: 'GCC Chalissery' },
  coach: { id: 'coach-sandeep', name: 'Sandeep', roleTitle: 'Technical Coach', academyId: 'gcc-chalissery', assignedSquadIds: ['u13'], phoneMasked: '+91 98XXXXXX10' },
  squads: [
    { id: 'u10', name: 'U10 Foundation Squad', ageCategory: 'U10', playerCount: 20, batch: 'Morning Batch', trainingDays: ['Wednesday', 'Friday', 'Sunday'], headCoachId: 'coach-junaid', assistantCoachIds: [] },
    { id: 'u13', name: demoConfig.player.category, ageCategory: 'U13', playerCount: 20, batch: 'Evening Batch', trainingDays: ['Tuesday', 'Thursday', 'Saturday'], headCoachId: 'coach-sandeep', assistantCoachIds: ['coach-junaid', 'coach-ashil'] },
    { id: 'u15', name: 'U15 Performance Squad', ageCategory: 'U15', playerCount: 20, batch: 'Evening Batch', trainingDays: ['Monday', 'Wednesday', 'Saturday'], headCoachId: 'coach-ramshad', assistantCoachIds: [] },
  ],
  players: academyPlayers,
  todaySession: { id: 'training-1', squadId: 'u13', date: demoConfig.timeline.currentDateLabel, shortDate: demoConfig.timeline.currentDateShort, time: demoConfig.timeline.currentSessionTime, ground: demoConfig.academy.primaryTrainingGround, coachId: 'coach-sandeep', focus: 'First touch and passing', status: 'upcoming', countdown: demoConfig.timeline.currentSessionCountdown },
  attendance: academyPlayers.map((player) => ({ playerId: player.id, sessionId: 'training-1', status: player.sessionStatus })),
  assessments: academyPlayers.map((player) => ({ id: player.latestAssessmentId ?? `assessment-${player.id}`, playerId: player.id, coachId: 'coach-sandeep', rating: player.latestRating, focus: player.focus, period: 'July 2026', strength: player.skills.reduce((best, skill) => skill.rating > best.rating ? skill : best).label, improvementArea: player.focus, updatedAt: demoConfig.timeline.latestAssessmentDate })),
  recentFeedback: [...latestFeedback, ...historicalFeedback],
  assignedLessons: learningLessons.map((lesson) => ({ id: lesson.id, title: lesson.title, assignedPlayerIds: academyPlayers.filter((player) => player.assignedLessonIds.includes(lesson.id)).map((player) => player.id) })),
  latestUpdate: { id: 'weekend-training-time-updated', title: 'Weekend Training Time Updated', summary: 'Saturday’s U13 session starts at 4:30 PM.', publishedAt: '2 hours ago' },
  feeRecords: [{ id: 'fee-july-2026', playerId: 'player-ayaan', amount: demoConfig.player.feeAmount, status: 'pending', dueDate: demoConfig.player.feeDueDate }],
  tasks: [
    { id: 'complete-attendance', type: 'attendance', title: 'Complete U13 attendance', supportingText: '19 of 20 players marked', status: 'pending', targetTab: 'attendance' },
    { id: 'add-feedback', type: 'assessment', title: 'Add feedback for 4 players', supportingText: 'Post-session development notes', status: 'pending', targetTab: 'players' },
    { id: 'review-plan', type: 'training-plan', title: 'Upcoming U13 session', supportingText: 'First touch and passing plan', status: 'in-progress', targetTab: 'training' },
  ],
};

export function getPlayerById(id: string): AcademyPlayer | undefined { return sharedAcademyData.players.find((player) => player.id === id || player.playerId === id); }
export function getPlayersBySquad(squadId: string): readonly AcademyPlayer[] { return sharedAcademyData.players.filter((player) => player.squadId === squadId); }
export function getPlayersByCategory(category: AgeCategory): readonly AcademyPlayer[] { return sharedAcademyData.players.filter((player) => player.category === category); }
export function searchPlayers(players: readonly AcademyPlayer[], query: string): readonly AcademyPlayer[] { const normalized = query.trim().toLowerCase(); if (!normalized) return players; return players.filter((player) => player.name.toLowerCase().includes(normalized) || player.playerId.toLowerCase().includes(normalized) || String(player.jerseyNumber) === normalized || player.position.toLowerCase().includes(normalized)); }
export function getLatestPlayerAssessment(playerId: string) { const player = getPlayerById(playerId); return player ? sharedAcademyData.assessments.find((assessment) => assessment.playerId === player.id) : undefined; }
export function getRecentPlayerFeedback(playerId: string) { const player = getPlayerById(playerId); return player ? sharedAcademyData.recentFeedback.filter((feedback) => feedback.playerId === player.id) : []; }
export function getAssignedPlayerLessons(playerId: string): readonly LearningLesson[] { const player = getPlayerById(playerId); return player ? player.assignedLessonIds.flatMap((lessonId) => { const lesson = getLessonById(lessonId); return lesson ? [lesson] : []; }) : []; }
