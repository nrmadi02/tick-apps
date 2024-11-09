import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-5 flex w-full flex-col items-center bg-primary p-5 py-10 text-white">
      <p className="text-2xl font-bold">Tick Apps</p>
      <div className="mt-4 flex w-max items-center gap-3">
        <Link href="#" className="text-white" prefetch={false}>
          <FacebookIcon className="size-5" />
          <span className="sr-only">Facebook</span>
        </Link>
        <Link href="#" className="text-white" prefetch={false}>
          <TwitterIcon className="size-5" />
          <span className="sr-only">Twitter</span>
        </Link>
        <Link href="#" className="text-white" prefetch={false}>
          <InstagramIcon className="size-5" />
          <span className="sr-only">Instagram</span>
        </Link>
        <Link href="#" className="text-white" prefetch={false}>
          <LinkedinIcon className="size-5" />
          <span className="sr-only">LinkedIn</span>
        </Link>
      </div>
      <div className="mt-5 flex w-max items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-gray-300" />
          <p className="text-md font-light text-gray-300">Tentang Kami</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-gray-300" />
          <p className="text-md font-light text-gray-300">Syarat & Ketentuan</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium">
        Copyright &copy; {new Date().getFullYear()} Tick Apps
      </p>
    </footer>
  );
}
