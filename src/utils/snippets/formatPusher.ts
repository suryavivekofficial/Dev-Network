export const formatChannelName = (username1: string, username2: string) => {
  const usernameArray = [username1.trim(), username2.trim()];
  const sortedUsernames = usernameArray.sort();

  const channelName = sortedUsernames.join("-");
  return channelName;
};
