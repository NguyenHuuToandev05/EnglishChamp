export interface Flashcard {
    id: string;
    frontText: string;
    backText: string;
    phonetic?: string | null;
    partOfSpeech?: string | null;
    exampleSentence?: string | null;
    exampleTranslation?: string | null;
    audioUrl?: string | null;
}