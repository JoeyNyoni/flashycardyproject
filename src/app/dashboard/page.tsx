import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { decks } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const userDecks = await db
    .select()
    .from(decks)
    .where(eq(decks.clerkUserId, userId));

  return (
    <main className="flex flex-1 flex-col gap-8 px-6 py-10 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Decks</h1>
        <p className="mt-1 text-muted-foreground">Manage and study your flashcard decks.</p>
      </div>

      {userDecks.length === 0 ? (
        <Card className="flex flex-1 flex-col items-center justify-center border-dashed py-20 text-center">
          <CardContent className="pt-6">
            <p className="text-lg font-medium text-foreground">No decks yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first deck to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userDecks.map((deck) => (
            <li key={deck.id}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{deck.name}</CardTitle>
                  {deck.description && (
                    <CardDescription className="line-clamp-2">{deck.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
