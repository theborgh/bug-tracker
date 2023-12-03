A bug tracker for use by software development teams built with Next.js, Prisma, and PostgreSQL.

Live demo [here](https://bug-tracker-sigma.vercel.app/).

## Getting Started

Clone the repository to your local machine and install dependencies:

```bash
git clone https://github.com/theborgh/bug-tracker.git
cd bug-tracker
npm i
```

Create a `.env.local` file in the root directory based on `.env.local.sample` and add the relevant environment variables. To enable login via GitHub and/or Discord, create a [GitHub OAuth App](https://docs.github.com/en/developers/apps/creating-an-oauth-app) and a [GitHub personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token), or a [Discord OAuth2 application](https://discord.com/developers/applications) and a [Discord bot token](https://discord.com/developers/applications).

Now you can run the development server:

```bash
npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
