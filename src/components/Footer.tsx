export function Footer() {
  return (
    <footer className="flex w-full items-center justify-center py-4 px-6 border-t border-[#DFDFDF] dark:border-[#4D4D4D]">
      <p className="text-sm text-center">
        Made with ❤️ by{' '}
        <a
          href="https://easonchang.com"
          target="_blank"
          rel="noreferrer"
          className="hover:underline underline-offset-4"
        >
          Eason Chang
        </a>
        {' & '}
        <a
          href="https://www.carolhsiao.com"
          target="_blank"
          rel="noreferrer"
          className="hover:underline underline-offset-4"
        >
          Carol Hsiao
        </a>
      </p>
    </footer>
  );
}
