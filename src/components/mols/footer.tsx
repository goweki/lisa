import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card/50 rounded-lg shadow-sm m-4">
      <div className="w-full mx-auto p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="https://lisa.goweki.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">LISA</a>. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link href="/privacy-policy" className="hover:underline hover:text-primary me-4 md:me-6">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/contacts" className="hover:underline hover:text-primary me-4 md:me-6">Contact</Link>
          </li>
          <li>
            <Link
              href="https://www.linkedin.com/company/lisa-techassistant"
              target="_blank" rel="noopener noreferrer"
              className="flex w-fit items-center hover:text-emerald-500"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 72 72"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z"
                    className="fill-current"
                  />
                  <path
                    d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
                    className="fill-background"
                  />
                </g>
              </svg>
              <span className="sr-only">LinkedIn page</span>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}