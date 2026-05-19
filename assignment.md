# Advanced Git & CI/CD Challenge

## 1. Workflow Architecture & Protection

### Recommended Branching Strategy: Trunk-Based Development

For a fast-moving startup, **Trunk-Based Development** is the best choice because it keeps the workflow simple, fast, and efficient. Developers work on short-lived feature branches and merge small changes frequently into the main branch through Pull Requests.

### Why Trunk-Based Development?

- Faster development and deployment cycles
- Reduces long-lived branch conflicts
- Easier collaboration for small and agile teams
- Encourages continuous integration and continuous delivery (CI/CD)
- Keeps the codebase stable and always deployable

---

### Branch Protection Rules for `main`

To prevent unstable or broken code from reaching production, the following GitHub Branch Protection Rules will be enforced on the `main` branch:

#### 1. Require Pull Request Before Merging
This prevents developers from pushing directly to the `main` branch.

#### 2. Require Status Checks to Pass Before Merging
All CI/CD tests must pass successfully before code can be merged.

#### 3. Require At Least One Approval
A team member must review and approve the Pull Request before merging.

#### 4. Restrict Direct Push Access
Only maintainers or administrators can manage the protected branch.

---

## 2. History Cleanup (Interactive Rebase)

### Purpose of Interactive Rebase

Interactive rebase helps developers clean up messy commit histories before submitting code for review. Instead of many small or unclear commits, developers can combine them into meaningful and organized commits.

---

### Difference Between `pick` and `squash`

#### `pick`
Keeps the commit exactly as it is during the rebase process.

Example:

```bash
pick abc123 added login page

### squash
Combines the selected commit with the previous commit.

Example:

```bash
squash def456 fixed typo
```

This creates a cleaner and more professional Git history.

### Interactive Rebase Command

To open an interactive rebase for the last 5 commits:

```bash
git rebase -i HEAD~5
```

Example commit list:

```bash
pick abc123 wip1
squash def456 wip2
squash ghi789 wip3
squash jkl012 typo
pick mno345 done
```

After saving and closing the editor, Git will combine the squashed commits into cleaner commits.

---

# 3. The Emergency Surgery (Cherry-Picking)

## What is `git cherry-pick`?

`git cherry-pick` allows developers to copy a specific commit from one branch and apply it to another branch without merging the entire branch.

This is perfect for emergencies where a critical bug fix exists on a broken development branch, but production needs only the fix itself.

---

## Emergency Scenario

A production bug fix was committed to the `develop` branch with the following commit hash:

```bash
8f3a9b2
```

However, the `develop` branch contains unstable and broken code, so merging the entire branch into `main` is unsafe.

---

## Safe Production Fix Commands

### Step 1: Switch to the `main` branch

```bash
git checkout main
```

### Step 2: Pull the latest updates

```bash
git pull origin main
```

### Step 3: Apply the specific bug fix commit

```bash
git cherry-pick 8f3a9b2
```

### Step 4: Push the fix to production

```bash
git push origin main
```

---

# 4. Integration Testing with Docker Compose (GitHub Actions)

## Why Run Integration Tests in CI Instead of Locally?

Running integration tests inside a CI pipeline is more reliable than local testing because:

- Every developer machine is different
- Local environments may have different dependencies or configurations
- CI pipelines provide a clean and consistent environment
- Automated testing prevents broken code from being merged
- Docker Compose allows testing the complete multi-container application exactly like production

This improves software quality and deployment confidence.

---

# GitHub Actions Workflow File

## File Path

```plaintext
.github/workflows/compose-test.yml
```

---

## Complete Workflow Configuration

```yaml
name: Docker Compose Integration Test

on:
  pull_request:
    branches:
      - main

jobs:
  integration-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Start Docker Compose Stack
        run: docker-compose up -d

      - name: Wait for Services to Initialize
        run: sleep 15

      - name: Test Web Service Availability
        run: curl -f http://localhost:8080 || exit 1

      - name: Show Docker Compose Logs
        if: always()
        run: docker-compose logs

      - name: Shutdown Docker Compose Stack
        if: always()
        run: docker-compose down
```

