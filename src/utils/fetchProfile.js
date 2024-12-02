import axios from "axios";

export const fetchChessComProfile = async (username) => {
  const url = `https://api.chess.com/pub/player/${username}`;
  const statsUrl = `https://api.chess.com/pub/player/${username}/stats`;
  try {
    const profileResponse = await axios.get(url);
    const statsResponse = await axios.get(statsUrl);

    const profileData = profileResponse.data;
    const statsData = statsResponse.data;

    const chessComName = profileData.name;
    const blitzRating = statsData.chess_blitz?.last?.rating || 0;
    const rapidRating = statsData.chess_rapid?.last?.rating || 0;

    return {
      success: true,
      profileUserName: chessComName,
      blitzRating,
      rapidRating,
    };
  } catch (error) {
    console.error("Error fetching Chess.com data:", error);
    return {
      success: false,
      message:
        "Failed to fetch data from Chess.com. Please check the username and try again.",
    };
  }
};

export const fetchLichessProfile = async (username) => {
  const url = `https://lichess.org/api/user/${username}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    const username = data.profile.realName;
    const blitzRating = data.perfs.blitz.rating;
    const rapidRating = data.perfs.rapid.rating;

    return {
      success: true,
      profileUserName: username,
      blitzRating,
      rapidRating,
    };
  } catch (error) {
    console.error("Error fetching Lichess.org data:", error);
    return {
      success: false,
      message:
        "Failed to fetch data from Lichess.org. Please check the username and try again.",
    };
  }
};

export const fetchChessProfile = async (username, platform) => {
  if (platform === "chess.com") {
    return fetchChessComProfile(username);
  }
  return fetchLichessProfile(username);
};
