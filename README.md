# Tezos Documentation Portal (Beta)

This is the source code for the Tezos Documentation Portal: https://docs.tezos.com

## Contributing

We welcome contributions to the documentation! Here's how you can get involved:

1. Fork the repository: Click the "Fork" button at the top-right corner of this page to create your own copy of the repository.

2. Clone your fork: Clone the repository to your local machine using `git clone https://github.com/<your-username>/<repository>.git`.

3. Create a branch: Create a new branch with a descriptive name for your changes, e.g., `git checkout -b my-feature`.

4. Make changes: Implement your changes, enhancements, or bug fixes on your branch.

5. Commit your changes: Add and commit your changes using `git add .` and `git commit -m "Your commit message"`.

6. Push your changes: Push your changes to your fork using `git push origin my-feature`.

7. Create a pull request: Navigate to the original repository on GitHub and click the "New Pull Request" button. Select your fork and branch, then click "Create Pull Request".

## Getting started

To setup the site locally, first install the npm dependencies:

```bash
npm install
cp .env.example .env.local
```

Next, run the development server:

```bash
npm run start
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.


## License

This project is open for contribution but the source code itself uses a commercial template and is therefore not licensed under any open-source license. Forking this project as a base for your own projects is not permitted under the license of the original template.
