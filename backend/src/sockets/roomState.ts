interface RoundAnswer {
    userId: string;
    isCorrect: boolean;
    answerTimeMs: number;
    points: number;
}

interface RoomState {
    roomCode: string;
    deckId: string;
    flashcardIds: string[];      // danh sách thẻ đã chọn cho cả trận, theo thứ tự
    currentRoundIndex: number;
    roundStartedAt: number | null;
    answers: Map<string, RoundAnswer>; // key = userId
    totalScores: Map<string, number>;  // key = userId
    timePerRoundSec: number;
    roundsTotal: number;
    playerIds: Set<string>;
    roundTimer: NodeJS.Timeout | null;
}

const activeRooms = new Map<string, RoomState>();

export function createRoomState(roomCode: string, deckId: string, timePerRoundSec: number, roundsTotal: number) {
    const state: RoomState = {
        roomCode,
        deckId,
        flashcardIds: [],
        currentRoundIndex: -1,
        roundStartedAt: null,
        answers: new Map(),
        totalScores: new Map(),
        timePerRoundSec,
        roundsTotal,
        playerIds: new Set(),
        roundTimer: null,
    };
    activeRooms.set(roomCode, state);
    return state;
}

export function getRoomState(roomCode: string) {
    return activeRooms.get(roomCode);
}

export function removeRoomState(roomCode: string) {
    activeRooms.delete(roomCode);
}