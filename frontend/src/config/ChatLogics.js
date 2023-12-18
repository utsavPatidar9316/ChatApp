export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderImage = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].pic : users[0].pic;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const formatLastSeen = (lastSeen) => {
  const currentDate = new Date();
  const lastSeenDate = new Date(lastSeen);

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate - lastSeenDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months >= 1) {
    // More than one month ago
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthName = monthNames[lastSeenDate.getMonth()];
    return `${monthName} ${lastSeenDate.getFullYear()}`;
  } else if (days > 1) {
    // More than one day ago
    return `${days} days ago`;
  } else if (days === 1) {
    // Yesterday
    return "Yesterday";
  } else if (hours >= 1) {
    // Today
    return `${hours} hours ago`;
  } else if (minutes >= 1) {
    // Within the last hour
    return `${minutes} minutes ago`;
  } else {
    // Within the last minute
    return "Just now";
  }
};

export const ampmTime = (timestamp) => {
  // Create a new Date object from the UTC timestamp
  const date = new Date(timestamp);
  // Extract hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM/PM and format the time
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  // Create the formatted time string
  return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
};

export const getDate = (date) => {
  const _date = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const isSameDay = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const diffInDays = Math.floor((today - _date) / (1000 * 60 * 60 * 24));

  if (isSameDay(_date, today)) {
    return "Today";
  } else if (isSameDay(_date, yesterday)) {
    return "Yesterday";
  } else if (diffInDays < 7 && _date < today) {
    return dayNames[_date.getDay()];
  } else {
    const dd = String(_date.getDate()).padStart(2, "0");
    const mm = String(_date.getMonth() + 1).padStart(2, "0");
    const yy = _date.getFullYear().toString().slice(-2);
    return `${dd}/${mm}/${yy}`;
  }
};
