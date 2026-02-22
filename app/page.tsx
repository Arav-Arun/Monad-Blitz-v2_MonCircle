"use client";

import React, { useState, useEffect } from "react";

export default function HostPortal() {
  const [activePage, setActivePage] = useState("dashboard");
  const [pageLabel, setPageLabel] = useState("Dashboard");
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [poolSize, setPoolSize] = useState(100);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [brandData, setBrandData] = useState({
    name: "",
    username: "",
    category: "Fashion & Apparel",
    website: "",
    email: "",
    country: "India",
    description: "",
  });
  const [apiKeys, setApiKeys] = useState({ apiKey: "", publicKey: "" });
  const [platformData, setPlatformData] = useState<any>(null);
  const [ecosystem, setEcosystem] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEcosystem();
    const saved = localStorage.getItem("mc_keys");
    if (saved) {
      const keys = JSON.parse(saved);
      setApiKeys(keys);
      fetchStats(keys.apiKey);
    } else {
      setLoading(false);
      setActivePage("onboarding");
      setPageLabel("New Host");
    }
  }, []);

  const fetchStats = async (key: string) => {
    try {
      const res = await fetch(`/api/v1/platform/stats?apiKey=${key}`);
      const data = await res.json();
      setPlatformData(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEcosystem = async () => {
    try {
      const res = await fetch("/api/v1/platforms");
      const data = await res.json();
      setEcosystem(data);
    } catch (err) {
      console.error("Failed to fetch ecosystem:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBrandData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!walletConnected) return alert("Please connect wallet first");
    setIsRegistering(true);
    try {
      // 0. Enforce Monad Testnet Switch
      await switchNetwork();

      // 1. Send Pool + 1 MON Protocol Fee
      const protocolFee = 1;
      const totalAmount = poolSize + protocolFee;
      const hexValue = (totalAmount * 1e18).toString(16);
      const feeCollector = "0x36E2829bD609D0Cc1F3BC9A7a56190B204c473Ec"; // MonCircle Main Wallet

      const txHash = await (window as any).ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: feeCollector,
            value: "0x" + hexValue,
          },
        ],
      });

      // 2. Register Platform
      const res = await fetch("/api/v1/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...brandData,
          monPool: poolSize,
          walletAddress,
          registrationTxHash: txHash,
        }),
      });
      const data = await res.json();
      const keys = { apiKey: data.apiKey, publicKey: data.publicKey };
      setApiKeys(keys);
      localStorage.setItem("mc_keys", JSON.stringify(keys));
      fetchStats(data.apiKey);
      fetchEcosystem();
      gs(5);
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Payment or registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("mc_keys");
    window.location.reload();
  };

  const gotoPage = (id: string, label: string) => {
    setActivePage(id);
    setPageLabel(label);
  };

  const gs = (n: number) => {
    setOnboardingStep(n);
  };

  const switchNetwork = async () => {
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x279f" }], // Monad Testnet Chain ID (10143)
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x279f",
                chainName: "Monad Testnet",
                nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
                rpcUrls: ["https://testnet-rpc.monad.xyz/"],
                blockExplorerUrls: ["https://testnet.monadvision.com/"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      }
    }
  };

  const handleWalletConnect = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        await switchNetwork();
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        return accounts[0];
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleLogin = async () => {
    try {
      const address = await handleWalletConnect();
      if (!address) return;

      const res = await fetch(
        `/api/v1/platforms/login?walletAddress=${address}`,
      );
      const data = await res.json();

      if (res.ok) {
        const keys = { apiKey: data.apiKey, publicKey: data.publicKey };
        setApiKeys(keys);
        localStorage.setItem("mc_keys", JSON.stringify(keys));
        fetchStats(data.apiKey);
        setActivePage("dashboard");
        setPageLabel("Dashboard");
      } else {
        alert(data.error || "Login failed. Are you registered?");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please try again.");
    }
  };

  if (loading)
    return (
      <div
        className="shell"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        Loading...
      </div>
    );

  return (
    <div className="shell">
      {/* SIDEBAR */}
      <aside className="side">
        <div className="side-logo">
          <div className="side-logo-mark">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1L11 4.5V7.5L6 11L1 7.5V4.5L6 1Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M6 3.5L9 5.5V6.5L6 8.5L3 6.5V5.5L6 3.5Z"
                fill="#6e54ff"
              />
            </svg>
          </div>
          MonCircle
        </div>

        <nav className="side-nav">
          <div className="side-section">Platform</div>
          <button
            className={`nav-a ${activePage === "dashboard" ? "on" : ""}`}
            onClick={() => gotoPage("dashboard", "Dashboard")}
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            >
              <rect x="1" y="1" width="5" height="5" rx="1" />
              <rect x="8" y="1" width="5" height="5" rx="1" />
              <rect x="1" y="8" width="5" height="5" rx="1" />
              <rect x="8" y="8" width="5" height="5" rx="1" />
            </svg>
            Dashboard
          </button>
          <button
            className={`nav-a ${activePage === "ecosystem" ? "on" : ""}`}
            onClick={() => gotoPage("ecosystem", "Ecosystem")}
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            >
              <circle cx="4" cy="4" r="3" />
              <circle cx="10" cy="10" r="3" />
              <path d="M7 4h3M4 10h3" />
            </svg>
            Ecosystem
          </button>
          <button
            className={`nav-a ${activePage === "rewards" ? "on" : ""}`}
            onClick={() => gotoPage("rewards", "Reward Rules")}
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            >
              <path d="M7 1.5l1.5 3 3.3.5-2.4 2.3.57 3.3L7 9l-3 1.6.57-3.3L2.2 5l3.3-.5z" />
            </svg>
            Reward Rules
          </button>
          <button
            className={`nav-a ${activePage === "settings" ? "on" : ""}`}
            onClick={() => gotoPage("settings", "Settings")}
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            >
              <circle cx="7" cy="7" r="2" />
              <path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1M3 3l.7.7M10.3 10.3l.7.7M11 3l-.7.7M3.7 10.3l-.7.7" />
            </svg>
            Settings
          </button>

          {!apiKeys.apiKey && (
            <React.Fragment>
              <div className="side-section" style={{ marginTop: "4px" }}>
                Admin
              </div>
              <button
                className={`nav-a ${activePage === "onboarding" ? "on" : ""}`}
                onClick={() => gotoPage("onboarding", "New Host")}
              >
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                >
                  <line x1="7" y1="1" x2="7" y2="13" />
                  <line x1="1" y1="7" x2="13" y2="7" />
                </svg>
                Register
              </button>
              <button className="nav-a" onClick={handleLogin}>
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                >
                  <path d="M10 7H2M8 4l3 3-3 3" />
                </svg>
                Login
              </button>
            </React.Fragment>
          )}
        </nav>

        <div className="side-foot">
          {platformData?.platform ? (
            <div
              className="side-account"
              onClick={logout}
              style={{ cursor: "pointer" }}
            >
              <div className="acct-av">{platformData.platform.name[0]}</div>
              <div>
                <div className="acct-name">{platformData.platform.name}</div>
                <div className="acct-sub">Click to Logout</div>
              </div>
            </div>
          ) : (
            <div className="side-account">
              <div className="acct-av">G</div>
              <div>
                <div className="acct-name">Guest</div>
                <div className="acct-sub">Not registered</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <span>Platform</span>
            <span className="topbar-sep">/</span>
            <span className="topbar-cur">{pageLabel}</span>
          </div>
          <div className="topbar-right">
            <div className="live-badge">
              <span className="live-dot" />
              Monad Testnet
            </div>
            {apiKeys.apiKey && (
              <button
                className="btn btn-default"
                onClick={() => fetchStats(apiKeys.apiKey)}
              >
                Refresh
              </button>
            )}
          </div>
        </header>

        <div className="content">
          {/* ECOSYSTEM PAGE */}
          {activePage === "ecosystem" && (
            <div className="page on">
              <div className="ph">
                <div>
                  <div className="ph-title">Ecosystem Directory</div>
                  <div className="ph-desc">
                    {ecosystem.length} brands building on MonCircle
                  </div>
                </div>
                <div className="ph-actions">
                  <button className="btn btn-default" onClick={fetchEcosystem}>
                    Refresh Directory
                  </button>
                </div>
              </div>

              <div className="eco-grid">
                {ecosystem.map((brand: any, i: number) => (
                  <div className="eco-card" key={i}>
                    <div className="eco-card-hd">
                      <div className="eco-av">{brand.name[0]}</div>
                      <div>
                        <div className="eco-name">{brand.name}</div>
                        <div className="eco-handle">
                          @
                          {brand.username ||
                            brand.name.toLowerCase().replace(/\s+/g, "_")}
                        </div>
                      </div>
                    </div>
                    <div className="eco-body">
                      <div className="eco-cat">{brand.category}</div>
                      <div className="eco-stats">
                        <div className="eco-stat">
                          <label>Rewards Issued</label>
                          <span>
                            {brand.monIssued?.toLocaleString() || "0"} MON
                          </span>
                        </div>
                        <div className="eco-stat">
                          <label>Pool Status</label>
                          <div
                            className="prog"
                            style={{ height: "4px", marginTop: "4px" }}
                          >
                            <div
                              className="prog-fill"
                              style={{
                                width: `${Math.min(100, (brand.monIssued / (brand.monPool + brand.monIssued)) * 100) || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eco-foot">
                      <a
                        href={
                          brand.website.startsWith("http")
                            ? brand.website
                            : `https://${brand.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="eco-link"
                      >
                        Visit Store
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M4 1h7v7M11 1L1 11" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DASHBOARD PAGE */}
          {activePage === "dashboard" &&
            platformData &&
            platformData.platform && (
              <div className="page on">
                <div className="ph">
                  <div>
                    <div className="ph-title">Overview</div>
                    <div className="ph-desc">
                      {platformData.platform.name} dashboard · live data
                    </div>
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat">
                    <div className="stat-k">MON Pool</div>
                    <div className="stat-v">
                      {platformData.platform.monPool.toLocaleString()}
                    </div>
                    <div className="prog">
                      <div
                        className="prog-fill"
                        style={{
                          width: `${Math.min(100, (platformData.platform.monIssued / (platformData.platform.monPool + platformData.platform.monIssued)) * 100) || 0}%`,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "4px",
                      }}
                    >
                      <span className="stat-d">
                        {(
                          (platformData.platform.monIssued /
                            (platformData.platform.monPool +
                              platformData.platform.monIssued)) *
                            100 || 0
                        ).toFixed(1)}
                        % used
                      </span>
                      <span
                        className="stat-d mono"
                        style={{ fontSize: "10px" }}
                      >
                        {platformData.platform.monPool.toLocaleString()} left
                      </span>
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-k">Total Issued</div>
                    <div className="stat-v">
                      {platformData.platform.monIssued.toLocaleString()}
                    </div>
                    <div className="stat-d up">
                      ↑ {platformData.recentOrders?.length || 0} recent
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-k">Unique Users</div>
                    <div className="stat-v">
                      {platformData.topUsers?.length || 0}
                    </div>
                    <div className="stat-d up">↑ active now</div>
                  </div>
                  <div className="stat">
                    <div className="stat-k">Base Rate</div>
                    <div className="stat-v">
                      {platformData.platform.rewardRate}%
                    </div>
                    <div className="stat-d">On-chain reward</div>
                  </div>
                </div>

                <div className="g32">
                  <div className="box">
                    <div className="box-head">
                      <div className="box-title">Recent Orders</div>
                    </div>
                    {platformData.recentOrders?.map((order: any, i: number) => (
                      <div className="act-row" key={i}>
                        <div className="act-icon">↑</div>
                        <div className="act-main">
                          <div>
                            +{order.monAwarded} MON · ₹{order.amount} purchase
                          </div>
                          <div className="act-time">
                            {order.userId} ·{" "}
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                        <span className="b b-g">
                          <span className="b-dot" />
                          issue
                        </span>
                      </div>
                    ))}
                    {platformData.recentOrders?.length === 0 && (
                      <div style={{ padding: "20px", color: "var(--text3)" }}>
                        No orders yet.
                      </div>
                    )}
                  </div>

                  <div className="box">
                    <div className="box-head">
                      <div className="box-title">Top Loyal Users</div>
                    </div>
                    <div style={{ padding: "8px" }}>
                      <table className="tbl" style={{ border: "none" }}>
                        <tbody>
                          {platformData.topUsers?.map((u: any, i: number) => (
                            <tr key={i}>
                              <td className="mono" style={{ padding: "8px" }}>
                                {u.userId.slice(0, 10)}...
                              </td>
                              <td
                                className="mono"
                                style={{
                                  color: "var(--purple)",
                                  fontWeight: 600,
                                }}
                              >
                                {u.balance} MON
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {platformData.topUsers?.length === 0 && (
                        <div style={{ padding: "20px", color: "var(--text3)" }}>
                          No users yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* ONBOARDING PAGE */}
          {activePage === "onboarding" && (
            <div className="page on mw">
              <div className="onb-hd">
                <div className="onb-eyebrow">
                  <span className="live-dot" /> Host registration
                </div>
                <div className="onb-title">Launch your MON Pool</div>
                <div className="onb-desc">
                  Deploy your on-chain loyalty program in minutes. Verification
                  fee: 0.1 MON.
                </div>
              </div>
              <div className="stepper">
                <div
                  className={`sn ${onboardingStep === 1 ? "active" : ""} ${onboardingStep > 1 ? "done" : ""}`}
                >
                  <div className="sc">1</div>
                  <div className="sl">Brand</div>
                </div>
                <div
                  className={`sn ${onboardingStep === 2 ? "active" : ""} ${onboardingStep > 2 ? "done" : ""}`}
                >
                  <div className="sc">2</div>
                  <div className="sl">Pool</div>
                </div>
                <div
                  className={`sn ${onboardingStep === 4 ? "active" : ""} ${onboardingStep > 4 ? "done" : ""}`}
                >
                  <div className="sc">3</div>
                  <div className="sl">Pay</div>
                </div>
                <div className={`sn ${onboardingStep === 5 ? "active" : ""}`}>
                  <div className="sc">✓</div>
                  <div className="sl">Done</div>
                </div>
              </div>

              {onboardingStep === 1 && (
                <div className="spanel on">
                  <div className="fsec">
                    <div className="fsec-body">
                      <div className="frow1">
                        <label>MonCircle Username</label>
                        <div
                          className="fi-pre"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                        >
                          <span className="fi-pre-lbl">@</span>
                          <input
                            className="fi"
                            type="text"
                            placeholder="unique_username"
                            value={brandData.username}
                            onChange={(e) =>
                              handleInputChange(
                                "username",
                                e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9_]/g, ""),
                              )
                            }
                          />
                        </div>
                        <div
                          className="stat-d"
                          style={{ marginTop: "4px", fontSize: "10px" }}
                        >
                          This will be your unique identifier on the protocol.
                        </div>
                      </div>
                      <div className="frow1" style={{ marginTop: "12px" }}>
                        <label>Brand Name</label>
                        <input
                          className="fi"
                          type="text"
                          placeholder="Adidas India"
                          value={brandData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                        />
                      </div>
                      <div className="frow">
                        <div>
                          <label>Website</label>
                          <input
                            className="fi"
                            type="text"
                            placeholder="shop.adidas.in"
                            value={brandData.website}
                            onChange={(e) =>
                              handleInputChange("website", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label>Email</label>
                          <input
                            className="fi"
                            type="email"
                            placeholder="contact@brand.com"
                            value={brandData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sact">
                    <button className="btn btn-default" onClick={handleLogin}>
                      Login with Wallet
                    </button>
                    <button className="btn btn-primary" onClick={() => gs(2)}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="spanel on">
                  <div className="fsec">
                    <div className="fsec-body">
                      <div className="frow1">
                        <label>Pool Size (MON)</label>
                        <div className="fi-suf">
                          <input
                            className="fi"
                            type="number"
                            value={poolSize}
                            onChange={(e) =>
                              setPoolSize(Number(e.target.value))
                            }
                          />
                          <span className="fi-suf-lbl">MON</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sact">
                    <button className="btn btn-default" onClick={() => gs(1)}>
                      Back
                    </button>
                    <button className="btn btn-primary" onClick={() => gs(4)}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 4 && (
                <div className="spanel on">
                  <div className="fsec">
                    <div className="fsec-body">
                      <div className="frow1">
                        <label>Wallet Connection</label>
                        <button
                          className={`wc ${walletConnected ? "ok" : ""}`}
                          onClick={handleWalletConnect}
                        >
                          {walletConnected
                            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                            : "Connect MetaMask"}
                        </button>
                      </div>
                      <div className="fee-list">
                        <div className="fee-row">
                          <span>Initial Pool</span>
                          <span className="fee-v">{poolSize} MON</span>
                        </div>
                        <div className="fee-row">
                          <span>Protocol Verification Fee</span>
                          <span className="fee-v">1 MON</span>
                        </div>
                        <div className="fee-row total">
                          <span>Total to Pay</span>
                          <span className="fee-v">{poolSize + 1} MON</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sact">
                    <button className="btn btn-default" onClick={() => gs(2)}>
                      Back
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleRegister}
                      disabled={isRegistering}
                    >
                      {isRegistering ? "Processing..." : "Pay & Register"}
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 5 && (
                <div className="spanel on">
                  <div className="ok-state">
                    <div className="ok-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="ok-title">Brand Registered!</div>
                    <div className="ok-body">
                      Your platform is live on Monad Testnet. Use these keys to
                      integrate the checkout SDK.
                    </div>
                    <div className="frow1">
                      <label>API Key</label>
                      <input
                        className="fi"
                        defaultValue={apiKeys.apiKey}
                        readOnly
                      />
                    </div>
                    <div className="sact" style={{ marginTop: "20px" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS PAGE */}
          {activePage === "settings" &&
            platformData &&
            platformData.platform && (
              <div className="page on mw">
                <div className="ph">
                  <div className="ph-title">Settings</div>
                </div>
                <div className="box">
                  <div className="fsec">
                    <div className="fsec-head">
                      <div className="fsec-title">Platform Identity</div>
                    </div>
                    <div className="fsec-body">
                      <div className="frow1">
                        <label>Public Key</label>
                        <input
                          className="fi mono"
                          readOnly
                          value={apiKeys.publicKey}
                        />
                      </div>
                      <div className="frow1">
                        <label>Secret API Key</label>
                        <input
                          className="fi mono"
                          readOnly
                          value={apiKeys.apiKey}
                          type="password"
                        />
                      </div>
                      <div className="frow1">
                        <label>Registration TX</label>
                        <div
                          className="fi mono"
                          style={{ fontSize: "11px", color: "var(--text3)" }}
                        >
                          {platformData.platform.registrationTxHash}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="fsec">
                    <div className="fsec-head">
                      <div className="fsec-title">Integration Code</div>
                      <div className="fsec-desc">
                        Add this script to your checkout page
                      </div>
                    </div>
                    <div className="fsec-body">
                      <textarea
                        className="fi mono"
                        style={{ height: "100px", fontSize: "11px" }}
                        readOnly
                        value={`<script \n  src="${window.location.origin}/sdk/overlay.js" \n  data-key="${apiKeys.publicKey}" \n  data-user-id="USER_ID" \n  data-amount="ORDER_AMOUNT">\n</script>`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* REWARDS PAGE */}
          {activePage === "rewards" &&
            platformData &&
            platformData.platform && (
              <div className="page on mw">
                <div className="ph">
                  <div className="ph-title">Reward Rules</div>
                </div>
                <div className="box">
                  <div className="fsec">
                    <div className="fsec-head">
                      <div className="fsec-title">Base Loyalty Rate</div>
                    </div>
                    <div className="fsec-body">
                      <div className="frow">
                        <div>
                          <label>Current Rate</label>
                          <div className="fi-suf">
                            <input
                              className="fi"
                              readOnly
                              value={platformData.platform.rewardRate}
                            />
                            <span className="fi-suf-lbl">MON / ₹100</span>
                          </div>
                        </div>
                        <div>
                          <label>Status</label>
                          <div className="b b-g" style={{ marginTop: "8px" }}>
                            <span className="b-dot" />
                            ACTIVE
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
