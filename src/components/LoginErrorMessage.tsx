import Link from "next/link";

const LoginErrorMessage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className="flex-row mx-5 flex-1">
        <div className="flex flex-wrap gap-4 ml">
          <p>
            You need to{" "}
            <Link href="/">
              <strong>log in</strong>
            </Link>{" "}
            to see this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginErrorMessage;
