import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ActivityTimeline } from "./activity-timeline";
import type { Activity } from "@/types";

const mockActivities: Activity[] = [
  {
    id: "act-1",
    type: "commit",
    title: "Pushed 3 commits",
    description: "Refactored auth module",
    repository: "codepulse",
    createdAt: new Date().toISOString(),
  },
  {
    id: "act-2",
    type: "pull_request",
    title: "Opened PR #45",
    description: "Added activity timeline filters",
    repository: "codepulse",
    createdAt: new Date().toISOString(),
  },
  {
    id: "act-3",
    type: "issue",
    title: "Created Issue #95",
    description: "Add activity type filter pills",
    repository: "codepulse",
    createdAt: new Date().toISOString(),
  },
  {
    id: "act-4",
    type: "achievement",
    title: "Unlocked Achievement",
    description: "Completed 50 challenges",
    createdAt: new Date().toISOString(),
  },
];

describe("ActivityTimeline", () => {
  it("renders Recent Activity title and all filter pills with count badges", () => {
    render(<ActivityTimeline activities={mockActivities} />);

    expect(screen.getByText("Recent Activity")).toBeDefined();
    expect(screen.getByText("All")).toBeDefined();
    expect(screen.getByText("Commits")).toBeDefined();
    expect(screen.getByText("PRs")).toBeDefined();
    expect(screen.getByText("Issues")).toBeDefined();
    expect(screen.getByText("Achievements")).toBeDefined();

    // Count badges
    expect(screen.getByText("4")).toBeDefined(); // All
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(4); // Commits, PRs, Issues, Achievements
  });

  it("filters activities when clicking on a category pill", async () => {
    render(<ActivityTimeline activities={mockActivities} />);

    // Initially all activities are displayed
    expect(screen.getByText("Pushed 3 commits")).toBeDefined();
    expect(screen.getByText("Opened PR #45")).toBeDefined();
    expect(screen.getByText("Created Issue #95")).toBeDefined();
    expect(screen.getByText("Unlocked Achievement")).toBeDefined();

    // Click on Commits filter pill
    const commitsPill = screen.getByText("Commits").closest("button");
    expect(commitsPill).toBeDefined();
    fireEvent.click(commitsPill!);

    // Only commit activity should remain displayed after exit animation completes
    await waitFor(() => {
      expect(screen.getByText("Pushed 3 commits")).toBeDefined();
      expect(screen.queryByText("Opened PR #45")).toBeNull();
      expect(screen.queryByText("Created Issue #95")).toBeNull();
      expect(screen.queryByText("Unlocked Achievement")).toBeNull();
    });
  });

  it("displays an empty state placeholder when a category has 0 events", () => {
    // Only commits
    const onlyCommits: Activity[] = [
      {
        id: "act-1",
        type: "commit",
        title: "Pushed 3 commits",
        description: "Refactored auth module",
        repository: "codepulse",
        createdAt: new Date().toISOString(),
      },
    ];

    render(<ActivityTimeline activities={onlyCommits} />);

    // Click on PRs filter pill
    const prsPill = screen.getByText("PRs").closest("button");
    fireEvent.click(prsPill!);

    // Empty state should appear
    expect(screen.getByText(/No prs activities found/i)).toBeDefined();
  });
});
