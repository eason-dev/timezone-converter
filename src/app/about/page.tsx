import { GithubIcon, GlobeIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import Image from 'next/image';

import { H1 } from '@/components/atoms/H1';
import { H2 } from '@/components/atoms/H2';
import { P2 } from '@/components/atoms/P2';
import { P3 } from '@/components/atoms/P3';
import { Button } from '@/components/ui/button';

import CarolImage from '../../../public/carol.jpeg';
import EasonImage from '../../../public/eason.jpg';

export default function About() {
  return (
    <article className="p-4 md:px-8 md:py-6">
      <H1 element="h2" className="mb-6">
        About
      </H1>
      <H2 element="h3" className="mb-4">
        Intro
      </H2>
      <p className="text-black dark:text-white text-base font-medium leading-7 mb-6">
        Hi there~ Thank you for using the Timez, we are the engineer and
        designer who built this tool.
        <br />
        Please feel free to leave any feedback to us via this form 👉{' '}
        <a
          href="https://forms.gle/h3uQRt9xWSavPdTg7"
          target="_blank"
          className="underline underline-offset-4"
          rel="noreferrer"
        >
          Feedback form
        </a>
        .
        <br />
        Also, this project is open source and available on GitHub. You can find
        the source code on 👉{' '}
        <a
          href="https://github.com/eason-dev/timezone-converter"
          target="_blank"
          className="underline underline-offset-4"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </p>
      <H2 element="h3" className="mb-4">
        Builders
      </H2>

      <div className="flex flex-col md:flex-row gap-8 flex-wrap">
        {/* Eason Card */}
        <div className="flex justify-between gap-4 items-center w-full max-w-[500px] rounded-md border border-[#DFDFDF] bg-popover p-4 md:p-6 dark:border-[#2F2F36] flex-wrap">
          <div className="flex gap-4 md:gap-6 items-center">
            <Image
              src={EasonImage}
              alt="Eason Chang"
              className="rounded-full w-14 h-14 md:w-20 md:h-20"
            />
            <div className="flex flex-col">
              <P2 className="text-black dark:text-white leading-5">
                Eason Chang
              </P2>
              <P3 className="text-[#7C7C7C] dark:text-[#DFDFDF] leading-6">
                Software Engineer
              </P3>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://x.com/EasonChang_me"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://www.linkedin.com/in/easonchang101/"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://easonchang.com/"
                target="_blank"
                rel="noreferrer"
              >
                <GlobeIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://github.com/eason-dev"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        {/* ./Eason Card */}

        {/* Carol Card */}
        <div className="flex justify-between gap-4 items-center w-full max-w-[500px] rounded-md border border-[#DFDFDF] bg-popover p-4 md:p-6 dark:border-[#2F2F36] flex-wrap">
          <div className="flex gap-4 md:gap-6 items-center">
            <Image
              src={CarolImage}
              alt="Carol Hsiao"
              className="rounded-full w-14 h-14 md:w-20 md:h-20"
            />
            <div className="flex flex-col">
              <P2 className="text-black dark:text-white leading-5">
                Carol Hsiao
              </P2>
              <P3 className="text-[#7C7C7C] dark:text-[#DFDFDF] leading-6">
                UIUX Designer
              </P3>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://x.com/CarolXiaoo"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://www.linkedin.com/in/carol-hsiao-5779a1158/"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://www.carolhsiao.com"
                target="_blank"
                rel="noreferrer"
              >
                <GlobeIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://github.com/carolhsiaoo"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        {/* ./Carol Card */}
      </div>
    </article>
  );
}
