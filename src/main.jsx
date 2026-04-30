import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Bot,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleDollarSign,
  CreditCard,
  Goal,
  Home,
  Landmark,
  LineChart,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingDown,
  Wallet,
  X,
} from "lucide-react";
import "./styles.css";

const categoryColors = {
  Food: "#ef8354",
  Transport: "#2d9cdb",
  Rent: "#425cbb",
  Books: "#22a06b",
  Fun: "#f2c94c",
  Income: "#22a06b",
  Other: "#7b8794",
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "transactions", label: "Transactions", icon: CreditCard },
  { id: "goals", label: "Goals", icon: Target },
];

const initialSubscriptions = [
  { id: 1, name: "Spotify", due: "Tomorrow", amount: 59, status: "Review" },
  { id: 2, name: "Adobe", due: "May 4", amount: 238, status: "Keep" },
  { id: 3, name: "Prime", due: "May 11", amount: 149, status: "Pause?" },
];

const initialGoals = [
  { id: 1, name: "New laptop", saved: 34800, target: 60000 },
  { id: 2, name: "Goa trip", saved: 10200, target: 18000 },
  { id: 3, name: "Emergency fund", saved: 16000, target: 25000 },
];

const initialTransactions = [
  { id: 1, title: "Canteen lunch", category: "Food", amount: -120, time: "10:45 AM" },
  { id: 2, title: "Freelance design", category: "Income", amount: 4200, time: "Yesterday" },
  { id: 3, title: "Metro card", category: "Transport", amount: -300, time: "Yesterday" },
  { id: 4, title: "Course notes", category: "Books", amount: -180, time: "Mon" },
  { id: 5, title: "Movie night", category: "Fun", amount: -340, time: "Sun" },
  { id: 6, title: "Hostel rent", category: "Rent", amount: -1200, time: "Sat" },
];

const syncedSamples = {
  upi: [
    { title: "UPI to Campus Cafe", category: "Food", amount: -95 },
    { title: "UPI refund", category: "Income", amount: 250 },
    { title: "UPI to Metro Recharge", category: "Transport", amount: -400 },
  ],
  bank: [
    { title: "Bank interest credit", category: "Income", amount: 162 },
    { title: "Debit card groceries", category: "Food", amount: -640 },
    { title: "ATM withdrawal", category: "Other", amount: -1000 },
  ],
};

const advicePool = [
  "Your food spending is 18% higher than last week. Set a soft cap of Rs 650 for the next seven days.",
  "Two subscriptions renew this week. Pausing one would move your Goa trip goal ahead by 5 days.",
  "You are saving Rs 320 more per week than planned. Nice momentum.",
  "Move Rs 500 into your emergency fund after your next income entry to stay ahead of your monthly target.",
  "Transport costs look stable. Keep the same weekly allowance for now.",
];

const analyticsData = {
  Weekly: {
    bars: [
      { label: "Mon", value: 220 },
      { label: "Tue", value: 380 },
      { label: "Wed", value: 160 },
      { label: "Thu", value: 540 },
      { label: "Fri", value: 310 },
      { label: "Sat", value: 760 },
      { label: "Sun", value: 430 },
    ],
    categories: [
      { name: "Food", amount: 920 },
      { name: "Transport", amount: 520 },
      { name: "Books", amount: 340 },
      { name: "Fun", amount: 720 },
      { name: "Other", amount: 300 },
    ],
    note: "Weekend spending is the main spike this week.",
  },
  Monthly: {
    bars: [
      { label: "Week 1", value: 2180 },
      { label: "Week 2", value: 1840 },
      { label: "Week 3", value: 2670 },
      { label: "Week 4", value: 2310 },
      { label: "Week 5", value: 1250 },
    ],
    categories: [
      { name: "Food", amount: 2850 },
      { name: "Transport", amount: 1180 },
      { name: "Rent", amount: 4800 },
      { name: "Books", amount: 620 },
      { name: "Fun", amount: 800 },
    ],
    note: "Rent dominates the month, while daily spending is steady.",
  },
  Yearly: {
    bars: [
      { label: "Jan", value: 8200 },
      { label: "Feb", value: 7600 },
      { label: "Mar", value: 9100 },
      { label: "Apr", value: 10250 },
      { label: "May", value: 8700 },
      { label: "Jun", value: 9400 },
      { label: "Jul", value: 7800 },
      { label: "Aug", value: 11200 },
      { label: "Sep", value: 9800 },
      { label: "Oct", value: 8900 },
      { label: "Nov", value: 10400 },
      { label: "Dec", value: 12100 },
    ],
    categories: [
      { name: "Food", amount: 31800 },
      { name: "Transport", amount: 14200 },
      { name: "Rent", amount: 57600 },
      { name: "Books", amount: 7600 },
      { name: "Fun", amount: 12850 },
    ],
    note: "December is highest because of travel and holiday plans.",
  },
};

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [goals, setGoals] = useState(initialGoals);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [adviceStart, setAdviceStart] = useState(0);
  const [budgetLimit, setBudgetLimit] = useState(4500);

  const totals = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const spending = Math.abs(
      transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    );
    const saved = goals.reduce((sum, goal) => sum + goal.saved, 0);
    const billsSoon = subscriptions
      .filter((subscription) => subscription.status !== "Paused")
      .reduce((sum, subscription) => sum + subscription.amount, 0);

    return { income, spending, saved, billsSoon, balance: 24580 + income - spending };
  }, [goals, subscriptions, transactions]);

  const categories = useMemo(() => {
    const grouped = transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((map, transaction) => {
        map[transaction.category] = (map[transaction.category] || 0) + Math.abs(transaction.amount);
        return map;
      }, {});

    return Object.entries(grouped).map(([name, amount]) => ({
      name,
      amount,
      color: categoryColors[name] || categoryColors.Other,
    }));
  }, [transactions]);

  const transactionSearch = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchingTransactions = normalizedQuery
      ? transactions.filter((transaction) =>
          [
            transaction.title,
            transaction.category,
            transaction.time,
            Math.abs(transaction.amount).toString(),
            formatMoney(transaction.amount),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : transactions;

    return {
      isSearching: Boolean(normalizedQuery),
      matches: matchingTransactions,
      dashboardVisible: transactions.slice(0, 4),
      pageVisible: matchingTransactions,
    };
  }, [query, transactions]);

  const insights = useMemo(
    () => [...advicePool.slice(adviceStart), ...advicePool.slice(0, adviceStart)].slice(0, 3),
    [adviceStart],
  );

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function addTransaction(entry) {
    setTransactions((current) => [
      {
        id: Date.now(),
        title: entry.title,
        category: entry.category,
        amount: entry.type === "income" ? Number(entry.amount) : -Number(entry.amount),
        time: "Just now",
      },
      ...current,
    ]);
    setModal(null);
    notify("Entry added to your tracker.");
  }

  function openEntry(type = "expense") {
    setModal({ name: "entry", type });
  }

  function connectAccount(type) {
    const isAlreadyConnected = connectedAccounts.includes(type);
    const label = type === "upi" ? "UPI app" : "bank account";

    if (!isAlreadyConnected) {
      setConnectedAccounts((current) => [...current, type]);
    }

    setTransactions((current) => [
      ...syncedSamples[type].map((transaction, index) => ({
        ...transaction,
        id: Date.now() + index,
        time: isAlreadyConnected ? "Synced again" : "Just synced",
      })),
      ...current,
    ]);
    notify(`${label} synced. New transactions imported.`);
  }

  function addGoal(goal) {
    setGoals((current) => [
      {
        id: Date.now(),
        name: goal.name,
        saved: Number(goal.saved),
        target: Number(goal.target),
      },
      ...current,
    ]);
    setModal(null);
    notify("Savings goal added.");
  }

  function scanSubscriptions() {
    const hasNetflix = subscriptions.some((subscription) => subscription.name === "Netflix");
    if (hasNetflix) {
      notify("Scan complete. No new subscriptions found.");
      return;
    }

    setSubscriptions((current) => [
      { id: Date.now(), name: "Netflix", due: "May 18", amount: 199, status: "Review" },
      ...current,
    ]);
    notify("Found 1 recurring payment.");
  }

  function cycleSubscription(id) {
    const nextStatus = { Review: "Keep", Keep: "Paused", "Pause?": "Paused", Paused: "Review" };
    setSubscriptions((current) =>
      current.map((subscription) =>
        subscription.id === id
          ? { ...subscription, status: nextStatus[subscription.status] || "Review" }
          : subscription,
      ),
    );
  }

  function boostGoal(id) {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id ? { ...goal, saved: Math.min(goal.target, goal.saved + 500) } : goal,
      ),
    );
    notify("Added Rs 500 toward the goal.");
  }

  const showDashboard = activeView === "dashboard";
  const showAnalytics = showDashboard || activeView === "analytics";
  const showTransactions = activeView === "transactions";
  const showGoals = showDashboard || activeView === "goals";
  const sectionHeadings = {
    dashboard: {
      eyebrow: "Connected money overview",
      title: "Sync your money automatically.",
    },
    analytics: {
      eyebrow: "Spending insights",
      title: "Analytics",
    },
    transactions: {
      eyebrow: "Money history",
      title: "Transactions",
    },
    goals: {
      eyebrow: "Targets and budget",
      title: "Goals",
    },
  };
  const heading = sectionHeadings[activeView] || sectionHeadings.dashboard;

  return (
    <main className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar-head">
          <button className="brand" type="button" onClick={() => setActiveView("dashboard")}>
            <span className="brand-mark">
              <CircleDollarSign size={24} />
            </span>
            <span>
              <strong>Personal Finance</strong>
              <small>Modern money tracker</small>
            </span>
          </button>
          <button
            className="collapse-button"
            type="button"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((current) => !current)}
          >
            {sidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeView === item.id ? "active" : ""}
                type="button"
                onClick={() => setActiveView(item.id)}
                key={item.id}
              >
                <Icon size={18} /> <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <section className="wallet-card">
          <Wallet size={22} />
          <span>Available balance</span>
          <strong>{formatMoney(totals.balance)}</strong>
          <button type="button" onClick={() => connectAccount("upi")}>
            <RefreshCw size={16} /> Sync data
          </button>
        </section>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p>{heading.eyebrow}</p>
            <h1>{heading.title}</h1>
          </div>
          {showTransactions && (
            <div className="top-actions">
              <label className="search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search transactions"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button
                    className="search-clear"
                    type="button"
                    aria-label="Clear transaction search"
                    onClick={() => setQuery("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </label>
              <button
                className="icon-button"
                type="button"
                aria-label="Notifications"
                onClick={() => setModal(modal === "notifications" ? null : "notifications")}
              >
                <Bell size={19} />
              </button>
            </div>
          )}
        </header>

        {modal === "notifications" && (
          <NotificationPopover
            subscriptions={subscriptions}
            onClose={() => setModal(null)}
            onReview={() => {
              setActiveView("transactions");
              setModal(null);
            }}
          />
        )}

        {showDashboard && (
          <section className="summary-grid" aria-label="Account summary">
            <MetricCard
              icon={<ArrowUpRight size={21} />}
              label="Income"
              value={formatMoney(totals.income)}
              note="+12% this month"
              tone="green"
            />
            <MetricCard
              icon={<ArrowDownLeft size={21} />}
              label="Spending"
              value={formatMoney(totals.spending)}
              note={`${formatMoney(Math.max(0, budgetLimit - totals.spending))} budget left`}
              tone="orange"
            />
            <MetricCard
              icon={<Goal size={21} />}
              label="Saved"
              value={formatMoney(totals.saved)}
              note={`${goals.length} goals active`}
              tone="blue"
            />
            <MetricCard
              icon={<TrendingDown size={21} />}
              label="Bills soon"
              value={formatMoney(totals.billsSoon)}
              note={`${subscriptions.length} renewals tracked`}
              tone="yellow"
            />
          </section>
        )}

        <>
            {showDashboard && (
              <QuickEntryPanel
                balance={totals.balance}
                connectedAccounts={connectedAccounts}
                onConnectUpi={() => connectAccount("upi")}
                onConnectBank={() => connectAccount("bank")}
                onManualFallback={() => openEntry("expense")}
              />
            )}

            {!showTransactions && (
              <section className={showDashboard ? "dashboard-grid" : "single-view-grid"}>
                {showAnalytics && (
                  <ExpenseAnalytics
                    categories={categories}
                    period={period}
                    onPeriodChange={() => {
                      const options = Object.keys(analyticsData);
                      setPeriod(options[(options.indexOf(period) + 1) % options.length]);
                    }}
                    isFocused={activeView === "analytics"}
                  />
                )}

                {showDashboard && (
                  <AdvicePanel
                    insights={insights}
                    onRefresh={() => {
                      setAdviceStart((current) => (current + 1) % advicePool.length);
                      notify("Advice refreshed.");
                    }}
                  />
                )}

                {!showDashboard && showGoals && (
                  <GoalsPanel
                    goals={goals}
                    spending={totals.spending}
                    budgetLimit={budgetLimit}
                    onBudgetChange={setBudgetLimit}
                    onAdd={() => setModal("goal")}
                    onBoost={boostGoal}
                  />
                )}
              </section>
            )}

            {showDashboard && (
              <TransactionsPanel
                transactions={transactionSearch.dashboardVisible}
                totalMatches={transactionSearch.matches.length}
                query={query}
                isSearching={transactionSearch.isSearching}
                actionLabel="View all"
                onAction={() => setActiveView("transactions")}
                onClearSearch={() => setQuery("")}
              />
            )}

            {showTransactions && (
              <TransactionsPage
                transactions={transactionSearch.pageVisible}
                totalMatches={transactionSearch.matches.length}
                query={query}
                isSearching={transactionSearch.isSearching}
                subscriptions={subscriptions}
                onClearSearch={() => setQuery("")}
                onAddExpense={() => openEntry("expense")}
                onAddIncome={() => openEntry("income")}
                onConnectUpi={() => connectAccount("upi")}
                onConnectBank={() => connectAccount("bank")}
                onScan={scanSubscriptions}
                onStatusChange={cycleSubscription}
              />
            )}
        </>
      </section>

      {modal?.name === "entry" && (
        <EntryModal
          initialType={modal.type}
          onClose={() => setModal(null)}
          onSubmit={addTransaction}
        />
      )}
      {modal === "goal" && <GoalModal onClose={() => setModal(null)} onSubmit={addGoal} />}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function ExpenseAnalytics({ period, onPeriodChange, isFocused }) {
  const analytics = analyticsData[period];
  const totalSpend = analytics.bars.reduce((sum, bar) => sum + bar.value, 0);
  const averageSpend = Math.round(totalSpend / analytics.bars.length);
  const maxSpend = Math.max(...analytics.bars.map((bar) => bar.value));
  const categories = analytics.categories.map((category) => ({
    ...category,
    color: categoryColors[category.name] || categoryColors.Other,
  }));
  const maxCategory = Math.max(1, ...categories.map((category) => category.amount));
  const topCategory = categories.reduce((top, category) =>
    category.amount > top.amount ? category : top,
  );

  return (
    <section className="panel spend-panel">
      <PanelTitle
        icon={<LineChart size={20} />}
        title="Expense analytics"
        action={period}
        onAction={onPeriodChange}
      />
      {isFocused && (
        <div className="analytics-stats">
          <article>
            <span>Total spend</span>
            <strong>{formatMoney(totalSpend)}</strong>
          </article>
          <article>
            <span>Average</span>
            <strong>{formatMoney(averageSpend)}</strong>
          </article>
          <article>
            <span>Top category</span>
            <strong>{topCategory.name}</strong>
          </article>
        </div>
      )}
      <div
        className="chart-area"
        style={{ "--bars": analytics.bars.length }}
        aria-label="Spending trend chart"
      >
        {analytics.bars.map((bar) => (
          <button
            className="bar"
            style={{ "--height": `${Math.max(28, (bar.value / maxSpend) * 100)}%` }}
            type="button"
            title={`${bar.label}: ${formatMoney(bar.value)}`}
            key={bar.label}
          >
            <span className="bar-value">{formatMoney(bar.value)}</span>
            <span className="bar-label">{bar.label}</span>
          </button>
        ))}
      </div>
      {isFocused && <p className="analytics-note">{analytics.note}</p>}
      <div className="category-list">
        {categories.map((category) => (
          <div className="category-row" key={category.name}>
            <span className="swatch" style={{ background: category.color }} />
            <span>{category.name}</span>
            <div className="track">
              <span
                style={{
                  width: `${Math.max(12, (category.amount / maxCategory) * 100)}%`,
                  background: category.color,
                }}
              />
            </div>
            <strong>{formatMoney(category.amount)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickEntryPanel({
  balance,
  connectedAccounts,
  onConnectUpi,
  onConnectBank,
  onManualFallback,
}) {
  const upiConnected = connectedAccounts.includes("upi");
  const bankConnected = connectedAccounts.includes("bank");

  return (
    <section className="quick-entry-panel">
      <article className="quick-entry-copy">
        <span>Automatic tracking</span>
        <h2>Sync UPI and bank activity directly.</h2>
        <p>Connect an account to import payments, refunds, card spends, and balance activity into your tracker.</p>
      </article>
      <div className="quick-entry-actions">
        <button className="quick-action upi-action" type="button" onClick={onConnectUpi}>
          <Smartphone size={24} />
          <span>{upiConnected ? "Sync UPI again" : "Connect UPI app"}</span>
          <small>PhonePe, GPay, Paytm-style imports</small>
        </button>
        <button className="quick-action bank-action" type="button" onClick={onConnectBank}>
          <Landmark size={24} />
          <span>{bankConnected ? "Sync bank again" : "Connect bank"}</span>
          <small>Cards, transfers, interest, ATM activity</small>
        </button>
      </div>
      <aside className="quick-balance">
        <ShieldCheck size={21} />
        <span>Current balance</span>
        <strong>{formatMoney(balance)}</strong>
        <button type="button" onClick={onManualFallback}>
          Manual fallback
        </button>
      </aside>
    </section>
  );
}

function AdvicePanel({ insights, onRefresh }) {
  return (
    <section className="panel advice-panel">
      <PanelTitle icon={<Bot size={20} />} title="AI money advice" action="Refresh" onAction={onRefresh} />
      <div className="advice-hero">
        <Sparkles size={28} />
        <h2>Smart moves for this week</h2>
      </div>
      <div className="insight-list">
        {insights.map((insight) => (
          <article className="insight" key={insight}>
            <Check size={17} />
            <p>{insight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SubscriptionsPanel({ subscriptions, onScan, onStatusChange }) {
  return (
    <section className="panel">
      <PanelTitle
        icon={<CalendarClock size={20} />}
        title="Subscription detector"
        action="Scan"
        onAction={onScan}
      />
      <div className="subscription-list">
        {subscriptions.map((subscription) => (
          <article className="subscription" key={subscription.id}>
            <div className="subscription-icon">
              <CreditCard size={18} />
            </div>
            <div>
              <strong>{subscription.name}</strong>
              <span>{subscription.due}</span>
            </div>
            <p>{formatMoney(subscription.amount)}</p>
            <button type="button" onClick={() => onStatusChange(subscription.id)}>
              {subscription.status}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function GoalsPanel({ goals, spending, budgetLimit, onBudgetChange, onAdd, onBoost }) {
  const budgetProgress = Math.min(100, Math.round((spending / Math.max(1, budgetLimit)) * 100));
  const budgetLeft = Math.max(0, budgetLimit - spending);

  return (
    <>
      <section className="panel budget-panel">
        <PanelTitle icon={<Target size={20} />} title="Monthly spending limit" action="Active" />
        <div className="budget-summary">
          <article>
            <span>Limit</span>
            <strong>{formatMoney(budgetLimit)}</strong>
          </article>
          <article>
            <span>Spent</span>
            <strong>{formatMoney(spending)}</strong>
          </article>
          <article>
            <span>Left</span>
            <strong>{formatMoney(budgetLeft)}</strong>
          </article>
        </div>
        <div className="budget-meter">
          <span style={{ width: `${budgetProgress}%` }} />
        </div>
        <label className="field budget-field">
          <span>Set monthly spending limit</span>
          <input
            type="number"
            min="500"
            step="100"
            value={budgetLimit}
            onChange={(event) => onBudgetChange(Number(event.target.value))}
          />
        </label>
      </section>

      <section className="panel">
        <PanelTitle icon={<Goal size={20} />} title="Savings goals" action="Add" onAction={onAdd} />
        <div className="goal-list">
          {goals.map((goal) => {
            const progress = Math.round((goal.saved / goal.target) * 100);
            return (
              <article className="goal-item" key={goal.id}>
                <div className="goal-copy">
                  <strong>{goal.name}</strong>
                  <span>
                    {formatMoney(goal.saved)} of {formatMoney(goal.target)}
                  </span>
                </div>
                <button className="goal-meter" type="button" onClick={() => onBoost(goal.id)}>
                  <span style={{ width: `${progress}%` }} />
                </button>
                <b>{progress}%</b>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function TransactionsPage({
  transactions,
  totalMatches,
  query,
  isSearching,
  subscriptions,
  onClearSearch,
  onAddExpense,
  onAddIncome,
  onConnectUpi,
  onConnectBank,
  onScan,
  onStatusChange,
}) {
  return (
    <section className="transactions-page-grid">
      <section className="transactions-tools">
        <button className="quick-action upi-action" type="button" onClick={onConnectUpi}>
          <Smartphone size={22} />
          <span>Sync UPI</span>
          <small>Import app payments</small>
        </button>
        <button className="quick-action bank-action" type="button" onClick={onConnectBank}>
          <Landmark size={22} />
          <span>Sync bank</span>
          <small>Import bank activity</small>
        </button>
        <button className="quick-action manual-action" type="button" onClick={onAddExpense}>
          <Plus size={22} />
          <span>Manual fallback</span>
          <small>Add cash or missing entries</small>
        </button>
        <button className="quick-action income-action" type="button" onClick={onAddIncome}>
          <ArrowUpRight size={22} />
          <span>Add income note</span>
          <small>For unlinked sources</small>
        </button>
      </section>

      <TransactionsPanel
        transactions={transactions}
        totalMatches={totalMatches}
        query={query}
        isSearching={isSearching}
        title="All transactions"
        actionLabel={isSearching ? "Clear" : "All"}
        onAction={isSearching ? onClearSearch : undefined}
        onClearSearch={onClearSearch}
      />

      <SubscriptionsPanel
        subscriptions={subscriptions}
        onScan={onScan}
        onStatusChange={onStatusChange}
      />
    </section>
  );
}

function TransactionsPanel({
  transactions,
  totalMatches,
  query,
  isSearching,
  title = "Recent transactions",
  actionLabel,
  onAction,
  onClearSearch,
}) {
  return (
    <section className="transactions-band">
      <PanelTitle
        icon={<CreditCard size={20} />}
        title={title}
        action={isSearching ? "Clear" : actionLabel || "View all"}
        onAction={isSearching ? onClearSearch : onAction}
      />
      {isSearching && (
        <div className="search-results-meta">
          <span>
            {totalMatches} result{totalMatches === 1 ? "" : "s"} for "{query.trim()}"
          </span>
        </div>
      )}
      <div className="transaction-list">
        {transactions.length === 0 ? (
          <p className="empty-state">No transactions match "{query}".</p>
        ) : (
          transactions.map((transaction) => (
            <article className="transaction" key={transaction.id}>
              <div className={transaction.amount > 0 ? "income-badge" : "expense-badge"}>
                {transaction.amount > 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
              </div>
              <div>
                <strong>{transaction.title}</strong>
                <span>{transaction.category}</span>
              </div>
              <time>{transaction.time}</time>
              <p className={transaction.amount > 0 ? "positive" : ""}>
                {transaction.amount > 0 ? "+" : ""}
                {formatMoney(transaction.amount)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function EntryModal({ initialType = "expense", onClose, onSubmit }) {
  const [entry, setEntry] = useState({
    title: "",
    category: initialType === "income" ? "Income" : "Food",
    amount: "",
    type: initialType,
  });

  function submit(event) {
    event.preventDefault();
    if (!entry.title.trim() || Number(entry.amount) <= 0) return;
    onSubmit(entry);
  }

  return (
    <Modal title="Add entry" onClose={onClose}>
      <form className="form-stack" onSubmit={submit}>
        <label className="field">
          <span>Name</span>
          <input
            value={entry.title}
            onChange={(event) => setEntry({ ...entry, title: event.target.value })}
            placeholder="Coffee, stipend, rent..."
            autoFocus
          />
        </label>
        <div className="split-fields">
          <label className="field">
            <span>Category</span>
            <select
              value={entry.category}
              onChange={(event) => setEntry({ ...entry, category: event.target.value })}
            >
              {Object.keys(categoryColors).map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              min="1"
              value={entry.amount}
              onChange={(event) => setEntry({ ...entry, amount: event.target.value })}
              placeholder="500"
            />
          </label>
        </div>
        <div className="segmented">
          <button
            className={entry.type === "expense" ? "active" : ""}
            type="button"
            onClick={() => setEntry({ ...entry, type: "expense" })}
          >
            Expense
          </button>
          <button
            className={entry.type === "income" ? "active" : ""}
            type="button"
            onClick={() => setEntry({ ...entry, type: "income", category: "Income" })}
          >
            Income
          </button>
        </div>
        <button className="primary-action" type="submit">
          Save entry
        </button>
      </form>
    </Modal>
  );
}

function GoalModal({ onClose, onSubmit }) {
  const [goal, setGoal] = useState({ name: "", saved: "", target: "" });

  function submit(event) {
    event.preventDefault();
    if (!goal.name.trim() || Number(goal.target) <= 0) return;
    onSubmit(goal);
  }

  return (
    <Modal title="Add savings goal" onClose={onClose}>
      <form className="form-stack" onSubmit={submit}>
        <label className="field">
          <span>Goal name</span>
          <input
            value={goal.name}
            onChange={(event) => setGoal({ ...goal, name: event.target.value })}
            placeholder="Bike, trip, emergency fund..."
            autoFocus
          />
        </label>
        <div className="split-fields">
          <label className="field">
            <span>Saved</span>
            <input
              type="number"
              min="0"
              value={goal.saved}
              onChange={(event) => setGoal({ ...goal, saved: event.target.value })}
              placeholder="1000"
            />
          </label>
          <label className="field">
            <span>Target</span>
            <input
              type="number"
              min="1"
              value={goal.target}
              onChange={(event) => setGoal({ ...goal, target: event.target.value })}
              placeholder="10000"
            />
          </label>
        </div>
        <button className="primary-action" type="submit">
          Create goal
        </button>
      </form>
    </Modal>
  );
}

function NotificationPopover({ subscriptions, onClose, onReview }) {
  const reviewCount = subscriptions.filter((subscription) => subscription.status === "Review").length;

  return (
    <aside className="notification-popover">
      <button className="close-button" type="button" aria-label="Close notifications" onClick={onClose}>
        <X size={18} />
      </button>
      <strong>{reviewCount} subscriptions need review</strong>
      <p>Upcoming renewals are being watched automatically.</p>
      <button type="button" onClick={onReview}>
        Review renewals
      </button>
    </aside>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <section className="modal-card">
        <header>
          <h2>{title}</h2>
          <button className="close-button" type="button" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, note, tone }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span className="metric-icon">{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function PanelTitle({ icon, title, action, onAction }) {
  return (
    <header className="panel-title">
      <div>
        {icon}
        <h2>{title}</h2>
      </div>
      {onAction ? (
        <button type="button" onClick={onAction}>
          {action} <ChevronDown size={15} />
        </button>
      ) : (
        <span className="panel-status">{action}</span>
      )}
    </header>
  );
}

createRoot(document.getElementById("root")).render(<App />);
