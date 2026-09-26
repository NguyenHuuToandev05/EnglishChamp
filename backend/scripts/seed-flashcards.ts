import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "../src/config/db";

interface DictionaryEntry {
    word: string;
    phonetic?: string;
    meanings: {
        partOfSpeech: string;
        definitions: { definition: string; example?: string }[];
    }[];
}

async function fetchWordData(word: string): Promise<DictionaryEntry | null> {
    const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    if (!res.ok) return null; // API trả 404 nếu không tìm thấy từ
    const data = (await res.json()) as DictionaryEntry[];
    return data[0] ?? null;
}

async function translateToVietnamese(text: string): Promise<string | null> {
    try {
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data.responseData?.translatedText ?? null;
    } catch {
        return null;
    }
}

async function main() {
    const deckId = process.argv[2];
    if (!deckId) {
        console.error("Cách dùng: npm run seed -- <deckId>");
        process.exit(1);
    }

    const wordListPath = path.join(__dirname, "../data/ielts-words.txt");
    const words = fs
        .readFileSync(wordListPath, "utf-8")
        .split("\n")
        .map((w) => w.trim())
        .filter(Boolean);

    console.log(`Bắt đầu seed ${words.length} từ vào deck ${deckId}...`);

    let success = 0;
    let skipped = 0;

    for (const word of words) {
        try {
            const entry = await fetchWordData(word);
            if (!entry) {
                console.log(`⚠️  Không tìm thấy: ${word}`);
                skipped++;
                continue;
            }

            const firstMeaning = entry.meanings[0];

            let definitionWithExample: { definition: string; example?: string } | undefined;
            for (const meaning of entry.meanings) {
                definitionWithExample = meaning.definitions.find((d) => d.example);
                if (definitionWithExample) break;
            }
            const firstDefinition = definitionWithExample ?? firstMeaning?.definitions[0];

            const backText = await translateToVietnamese(entry.word);

            const exampleTranslation = firstDefinition?.example
                ? await translateToVietnamese(firstDefinition.example)
                : null;

            await prisma.flashcard.create({
                data: {
                    deckId: BigInt(deckId),
                    frontText: entry.word,
                    backText: backText ?? "(chưa dịch được, tự điền tay)",
                    phonetic: entry.phonetic ?? null,
                    partOfSpeech: firstMeaning?.partOfSpeech ?? null,
                    exampleSentence: firstDefinition?.example ?? null,
                    exampleTranslation: exampleTranslation ?? null,
                },
            });

            console.log(`${word} -> ${backText ?? "(không dịch được)"}`);
            success++;

            await new Promise((r) => setTimeout(r, 500));
        } catch (error) {
            console.log(`Lỗi ở từ "${word}":`, error instanceof Error ? error.message : error);
            skipped++;
        }
    }

    await prisma.deck.update({
        where: { id: BigInt(deckId) },
        data: { cardCount: { increment: success } },
    });

    console.log(`\nXong! Thành công: ${success}, Bỏ qua: ${skipped}`);
    await prisma.$disconnect();
}

main();