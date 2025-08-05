const chars = "0123456789";

type RandomTokenDto = {
  length: number;
};

export const randomToken = ({ length }: RandomTokenDto): string => {
  if (length > 20) {
    throw new Error("Random token is too large");
  }
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};
