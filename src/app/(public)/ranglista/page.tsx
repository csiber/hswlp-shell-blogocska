import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NavFooterLayout from "@/layouts/NavFooterLayout";
import { getBlogDB } from "@/db";
import {
  postReadTable,
  postsTable,
  userTable,
  postCategoryTable,
  POST_STATUS,
} from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { getUserDisplayName } from "@/utils/user";
import { getInitials } from "@/utils/name-initials";
import { getSessionFromCookie } from "@/utils/auth";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Ranglista",
};

export default async function RanglistaPage() {
  const db = getBlogDB();

  const topPostsRaw = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      userId: postsTable.user_id,
      reads: sql<number>`cast(count(${postReadTable.id}) as int)`,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      nickname: userTable.nickname,
    })
    .from(postsTable)
    .leftJoin(postReadTable, eq(postReadTable.post_id, postsTable.id))
    .leftJoin(userTable, eq(postsTable.user_id, userTable.id))
    .where(eq(postsTable.status, POST_STATUS.APPROVED))
    .groupBy(postsTable.id)
    .orderBy(desc(sql<number>`count(${postReadTable.id})`))
    .limit(10);

  const topPosts = topPostsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    reads: p.reads,
    authorName:
      p.nickname ||
      (p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.userId),
    userId: p.userId,
  }));

  const topAuthorsRaw = await db
    .select({
      userId: postsTable.user_id,
      postCount: sql<number>`cast(count(${postsTable.id}) as int)`,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      nickname: userTable.nickname,
      avatar: userTable.avatar,
    })
    .from(postsTable)
    .leftJoin(userTable, eq(postsTable.user_id, userTable.id))
    .where(eq(postsTable.status, POST_STATUS.APPROVED))
    .groupBy(postsTable.user_id)
    .orderBy(desc(sql<number>`count(${postsTable.id})`))
    .limit(10);

  const topAuthors = topAuthorsRaw.map((a) => ({
    userId: a.userId,
    postCount: a.postCount,
    name:
      a.nickname ||
      (a.firstName && a.lastName ? `${a.firstName} ${a.lastName}` : a.userId),
    avatar: a.avatar ?? undefined,
  }));

  const categories = await db
    .select({
      slug: postsTable.category,
      count: sql<number>`cast(count(${postsTable.id}) as int)`,
      name: postCategoryTable.name,
    })
    .from(postsTable)
    .leftJoin(postCategoryTable, eq(postCategoryTable.slug, postsTable.category))
    .where(eq(postsTable.status, POST_STATUS.APPROVED))
    .groupBy(postsTable.category)
    .orderBy(desc(sql<number>`count(${postsTable.id})`));

  const latestReadsRaw = await db
    .select({
      userId: postReadTable.user_id,
      postId: postReadTable.post_id,
      createdAt: postReadTable.created_at,
      title: postsTable.title,
    })
    .from(postReadTable)
    .leftJoin(postsTable, eq(postsTable.id, postReadTable.post_id))
    .orderBy(desc(postReadTable.created_at))
    .limit(20);

  const latestReads = await Promise.all(
    latestReadsRaw.map(async (r) => ({
      ...r,
      userName: await getUserDisplayName(r.userId),
    }))
  );

  const session = await getSessionFromCookie();

  const maxCategoryCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <NavFooterLayout>
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 poszt</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cím</TableHead>
                  <TableHead>Szerző</TableHead>
                  <TableHead className="text-right">Olvasás</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPosts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link href={`/blog/post/${p.id}`}>{p.title}</Link>
                    </TableCell>
                    <TableCell>{p.authorName}</TableCell>
                    <TableCell className="text-right">{p.reads}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 szerző</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Szerző</TableHead>
                  <TableHead className="text-right">Posztok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAuthors.map((a) => (
                  <TableRow key={a.userId}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={a.avatar ?? ""} alt={a.name} />
                        <AvatarFallback>{getInitials(a.name)}</AvatarFallback>
                      </Avatar>
                      <Link href={session?.user?.id === a.userId ? "/me" : `/szerzo/${a.userId}`}>{a.name}</Link>
                    </TableCell>
                    <TableCell className="text-right">{a.postCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legnépszerűbb kategóriák</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.slug} className="flex items-center gap-2">
                <Badge className="capitalize">{cat.name || cat.slug}</Badge>
                <div className="h-2 flex-1 bg-muted relative rounded">
                  <div
                    className="absolute left-0 top-0 h-2 bg-primary rounded"
                    style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm">{cat.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legutóbb jutalmazott olvasók</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Felhasználó</TableHead>
                  <TableHead>Poszt</TableHead>
                  <TableHead className="text-right">Időpont</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestReads.map((r) => (
                  <TableRow key={`${r.userId}-${r.postId}-${r.createdAt.toISOString()}`}>
                    <TableCell>{r.userName}</TableCell>
                    <TableCell>
                      <Link href={`/blog/post/${r.postId}`}>{r.title}</Link>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </NavFooterLayout>
  );
}
