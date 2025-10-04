export interface Result {
  success: boolean;
  game?: string;
  id?: number | string;
  server?: string | number;
  name?: string;
  message?: string;
  error?: unknown;
}
const BASE_URL_VALIDATE_NICKNAME = process.env.NEXT_PUBLIC_CHECK_NICKNAME_URL;
export async function CheckNickName({
  type,
  gameId,
  serverId,
}: {
  type: string;
  gameId: string;
  serverId?: string;
}): Promise<Result> {
  let url = `${BASE_URL_VALIDATE_NICKNAME}/default?id=${gameId}`;

  if (type === "mobile-legends") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/ml?id=${parseInt(
      gameId
    )}&server=${serverId}`;
  } else if (type === "genshin-impact") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/gi?id=${gameId}`;
  } else if (type === "honkai-star-rail") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/hsr?id=${parseInt(gameId)}`;
  } else if (type === "free-fire") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/ff?id=${parseInt(gameId)}`;
  } else if (type === "valorant") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/valo?id=${encodeURIComponent(
      parseInt(gameId)
    )}`;
  } else if (type === "arena-of-valor") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/aov?id=${encodeURIComponent(
      parseInt(gameId)
    )}`;
  } else if (type === "call-of-duty-mobile") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/cod?id=${encodeURIComponent(
      parseInt(gameId)
    )}`;
  } else if (type === "aether-gazer") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/ag?id=${encodeURIComponent(
      parseInt(gameId)
    )}`;
  } else if (type === "punishing-gray-raven") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/ag?id=${encodeURIComponent(
      parseInt(gameId)
    )}`;
  } else if (type === "point-blank") {
    url = `${BASE_URL_VALIDATE_NICKNAME}/pb?id=${encodeURIComponent(
      parseInt(gameId)
    )}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();
    return {
      success: data.success || false,
      game: type,
      id: gameId,
      server: data.server || null,
      name: data.name || null,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : error,
      success: false,
    };
  }
}
