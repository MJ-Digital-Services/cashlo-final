// @ts-nocheck
'use client';
// Drop-in replacement for the old HowItWorks.tsx. Heavily DOM-imperative
// (querySelector/getElementById-driven GSAP scrubbing), so it's left
// unchecked rather than retrofitted with strict typing.

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// cashlo-logo.png lives in /public — plain string path, not a static
// import, so it works as a raw src on every <img> below without Next.js
// turning it into a { src, width, height } object.
const logo = '/cashlo-logo.png';

export default function HowItWorks() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const frameStepMap = [0,0,0,0,0, 1,1,1,1, 2,2,2, 3,3,3,3,3,3,3,3,3,3,3];
    const TOTAL_FRAMES = frameStepMap.length;
    const stepTagCounts = [4,3,3,6];

    const panes = root.querySelectorAll('.step-pane');
    const progFills = root.querySelectorAll('.prog-fill');
    const progItems = root.querySelectorAll('.prog-item');
    const screens = root.querySelectorAll('.screen-inner');

    let currentFrame = -1;
    let currentStep = -1;

    function buildQR(el) {
      if (!el) return;
      el.innerHTML = '';
      for (let i = 0; i < 81; i++) {
        const s = document.createElement('span');
        if (Math.random() > 0.45) s.className = 'off';
        el.appendChild(s);
      }
    }
    ['qrGrid', 'qrGrid2', 'qrGridGen'].forEach((id) => buildQR(root.querySelector('#' + id)));

    function updateTags(stepIdx, frameIdx) {
      const pane = root.querySelector('.step-pane[data-step="' + stepIdx + '"]');
      if (!pane) return;
      const tags = pane.querySelectorAll('.step-tag');
      const stepStart = frameStepMap.indexOf(stepIdx);
      const localFrame = frameIdx - stepStart;
      const count = stepTagCounts[stepIdx];
      const frameCount = frameStepMap.filter((s) => s === stepIdx).length;
      const tagIdx = Math.min(count - 1, Math.floor((localFrame / frameCount) * count));
      tags.forEach((t, i) => t.classList.toggle('on', i <= tagIdx));
    }

    function applyFrame(frameIdx, localProgress) {
      if (frameIdx !== currentFrame) {
        currentFrame = frameIdx;
        screens.forEach((s) => s.classList.remove('is-on'));
        const target = root.querySelector('.screen-inner[data-frame="' + frameIdx + '"]');
        if (target) target.classList.add('is-on');

        const stepIdx = frameStepMap[frameIdx];
        if (stepIdx !== currentStep) {
          currentStep = stepIdx;
          panes.forEach((p) => p.classList.toggle('is-active', +p.dataset.step === stepIdx));
          progItems.forEach((p) => p.classList.toggle('is-active', +p.dataset.p === stepIdx));
        }
        updateTags(stepIdx, frameIdx);
        if (frameIdx === 10) {
          const row = root.querySelector('#kycRow2');
          if (row) row.classList.add('pending');
        }
        const toast = root.querySelector('.toast-anim');
        if (toast) toast.classList.remove('show');
      }

      if (frameIdx === 2) {
        const pct = Math.round(localProgress * 100);
        const el = root.querySelector('#installPct');
        if (el) el.textContent = 'Downloading… ' + pct + '%';
        const arc = root.querySelector('[data-frame="2"] .ring-arc');
        if (arc) arc.setAttribute('stroke-dashoffset', 113 - 113 * localProgress);
      }
      if (frameIdx === 10) {
        const r2 = root.querySelector('#kycRow2');
        if (r2) {
          if (localProgress > 0.7) {
            r2.classList.remove('pending');
            const icon = r2.querySelector('.kyc-icon');
            icon.className = 'kyc-icon';
            icon.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          } else {
            r2.classList.add('pending');
          }
        }
      }
      if (frameIdx === 17) {
        const amtEl = root.querySelector('#payAmt');
        if (amtEl) amtEl.textContent = '₹' + Math.round(localProgress * 1000);
        const toastEl = root.querySelector('[data-frame="17"] .toast-anim');
        if (toastEl) {
          if (localProgress > 0.15 && localProgress < 0.85) toastEl.classList.add('show');
          else toastEl.classList.remove('show');
        }
      }
      if (frameIdx === 19) {
        const el = root.querySelector('#commAmt');
        if (el) el.textContent = '₹' + Math.round(localProgress * 10);
      }
      if (frameIdx === 20) {
        const el = root.querySelector('#walletBal');
        if (el) el.textContent = '₹' + Math.round(20000 + localProgress * 1000).toLocaleString('en-IN');
      }

      const stepIdx2 = frameStepMap[frameIdx];
      const stepStart = frameStepMap.indexOf(stepIdx2);
      const stepFrameCount = frameStepMap.filter((s) => s === stepIdx2).length;
      const withinStep = (frameIdx - stepStart + localProgress) / stepFrameCount;
      progFills.forEach((f, i) => {
        if (i < stepIdx2) f.style.width = '100%';
        else if (i === stepIdx2) f.style.width = withinStep * 100 + '%';
        else f.style.width = '0%';
      });
    }

    const trigger = ScrollTrigger.create({
      trigger: root.querySelector('#hiwScroll'),
      start: 'top top',
      end: 'bottom bottom',
      pin: root.querySelector('.hiw-pin'),
      scrub: 0.2,
      onUpdate: (self) => {
        const pos = self.progress * TOTAL_FRAMES;
        const idx = Math.min(TOTAL_FRAMES - 1, Math.floor(pos));
        applyFrame(idx, pos - idx);
      },
      onEnter: () => applyFrame(0, 0),
    });
    applyFrame(0, 0);

    const particleHost = root.querySelector('#particles');
    const particleEls = [];
    if (particleHost) {
      for (let p = 0; p < 14; p++) {
        const el = document.createElement('div');
        el.className = 'particle';
        el.style.left = Math.random() * 100 + '%';
        el.style.top = Math.random() * 100 + '%';
        el.style.animationDelay = Math.random() * 6 + 's';
        el.style.animationDuration = 7 + Math.random() * 5 + 's';
        particleHost.appendChild(el);
        particleEls.push(el);
      }
    }

    let onMove, onLeave;
    const phoneWrap = root.querySelector('#phoneWrap');
    const hiwPin = root.querySelector('.hiw-pin');
    if (!reduced && phoneWrap && hiwPin) {
      onMove = (e) => {
        const r = hiwPin.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5;
        const my = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(phoneWrap, { rotateY: mx * 10, rotateX: -my * 10, duration: 0.4, ease: 'power2.out' });
      };
      onLeave = () => gsap.to(phoneWrap, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' });
      hiwPin.addEventListener('mousemove', onMove);
      hiwPin.addEventListener('mouseleave', onLeave);
    }

    return () => {
      trigger.kill();
      if (hiwPin && onMove) hiwPin.removeEventListener('mousemove', onMove);
      if (hiwPin && onLeave) hiwPin.removeEventListener('mouseleave', onLeave);
      particleEls.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div ref={rootRef} className="hiw-root">
      <section className="hiw" id="how-it-works">
  <div className="hiw-orbs"><div className="orb orb-a"></div><div className="orb orb-b"></div></div>
  <div className="particles" id="particles"></div>

  <div className="hiw-head">
    {/* <img className="brand-logo" src={logo} alt="Cashlo" /> */}
    <span className="hiw-eyebrow">HOW CASHLO WORKS</span>
    <h2>From download to <span>daily earnings</span></h2>
    <p>Scroll to follow the complete merchant journey — install, register, verify, and start earning commission on every transaction.</p>
  </div>

  <div className="hiw-scroll" id="hiwScroll">
    <div className="hiw-pin">
      <div className="hiw-grid">

        <div className="hiw-left">
          <div className="step-frame" id="stepFrame">
            <div className="step-pane" data-step="0">
              <div className="step-num">01</div><h3 className="step-title">Install Cashlo</h3>
              <p className="step-desc">Find Cashlo on the Play Store, install it, and it launches straight into the app.</p>
              <div className="step-tags"><span className="step-tag">Search</span><span className="step-tag">Install</span><span className="step-tag">Download</span><span className="step-tag">Launch</span></div>
            </div>
            <div className="step-pane" data-step="1">
              <div className="step-num">02</div><h3 className="step-title">Register</h3>
              <p className="step-desc">Sign in with your mobile number and a one-time password — no passwords to remember.</p>
              <div className="step-tags"><span className="step-tag">Mobile number</span><span className="step-tag">OTP</span><span className="step-tag">Registered</span></div>
            </div>
            <div className="step-pane" data-step="2">
              <div className="step-num">03</div><h3 className="step-title">Complete KYC</h3>
              <p className="step-desc">Upload Aadhaar and PAN — verification runs automatically and confirms in seconds.</p>
              <div className="step-tags"><span className="step-tag">Aadhaar/PAN</span><span className="step-tag">Verifying</span><span className="step-tag">Verified</span></div>
            </div>
            <div className="step-pane" data-step="3">
              <div className="step-num">04</div><h3 className="step-title">Activate &amp; start earning</h3>
              <p className="step-desc">Activate your services, generate a live QR, get paid, hand out cash through UPI Cash Point, and watch commission land in your wallet.</p>
              <div className="step-tags"><span className="step-tag">Activate</span><span className="step-tag">QR live</span><span className="step-tag">Payment</span><span className="step-tag">Cash Point</span><span className="step-tag">Commission</span><span className="step-tag">Dashboard</span></div>
            </div>
          </div>

          <div className="hiw-progress" id="hiwProgress">
            <div className="prog-item" data-p="0"><div className="prog-track"><div className="prog-fill"></div></div><div className="prog-label">Install</div></div>
            <div className="prog-item" data-p="1"><div className="prog-track"><div className="prog-fill"></div></div><div className="prog-label">Register</div></div>
            <div className="prog-item" data-p="2"><div className="prog-track"><div className="prog-fill"></div></div><div className="prog-label">KYC</div></div>
            <div className="prog-item" data-p="3"><div className="prog-track"><div className="prog-fill"></div></div><div className="prog-label">Activate &amp; earn</div></div>
          </div>
        </div>

        <div className="hiw-right">
          <div className="phone-glow"></div>
          <div className="phone-wrap phone-float" id="phoneWrap">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="dyn-island"></div>

                {/* ============ STEP 1: INSTALL (frames 0-4) ============ */}

                {/* 0: Play Store search */}
                <div className="screen-inner" data-frame="0"><div className="scr-pad">
                  <div className="search-field">🔍&nbsp; Cashlo</div>
                  <div className="card store-row" style={{marginTop: '14px'}}><div className="app-icon"><img src={logo} alt="Cashlo" /></div><div><div style={{fontWeight: '800', fontSize: '13px'}}>Cashlo</div><div style={{fontSize: '10.5px', color: 'var(--muted)'}}>Finance • 4.8★ • MJ Digital Services</div></div></div>
                </div></div>

                {/* 1: Install tap */}
                <div className="screen-inner" data-frame="1"><div className="scr-pad">
                  <div className="card store-row"><div className="app-icon"><img src={logo} alt="Cashlo" /></div><div><div style={{fontWeight: '800', fontSize: '13px'}}>Cashlo</div><div style={{fontSize: '10.5px', color: 'var(--muted)'}}>Finance • 4.8★</div></div></div>
                  <div className="btn" style={{marginTop: '12px'}}>Install</div>
                </div></div>

                {/* 2: Download progress */}
                <div className="screen-inner" data-frame="2"><div className="scr-pad" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                  <div className="ring-check"><svg width="44" height="44"><circle cx="22" cy="22" r="18" stroke="#E4E7FA" strokeWidth="4" fill="none"/><circle className="ring-arc" cx="22" cy="22" r="18" stroke="#445EF1" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="113"/></svg></div>
                  <div style={{marginTop: '10px', fontWeight: '700', fontSize: '12px'}} id="installPct">Downloading… 0%</div>
                </div></div>

                {/* 3: Installed */}
                <div className="screen-inner" data-frame="3"><div className="scr-pad" style={{textAlign: 'center'}}>
                  <div className="check-badge" style={{marginTop: '34px'}}><div className="app-icon" style={{width: '44px', height: '44px', border: 'none'}}><img src={logo} alt="Cashlo" /></div></div>
                  <div style={{marginTop: '14px', fontWeight: '800', fontSize: '14px'}}>App installed</div>
                  <div className="btn" style={{marginTop: '18px'}}>Open</div>
                </div></div>

                {/* 4: Splash / auto-launch */}
                <div className="screen-inner" data-frame="4">
                  <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div className="cashlo-logo"><img src={logo} alt="Cashlo" style={{height: '38px'}} /></div>
                    <div style={{fontSize: '11px', color: 'var(--muted)', marginTop: '10px'}}>Earn more, every day</div>
                  </div>
                </div>

                {/* ============ STEP 2: REGISTER (frames 5-8) ============ */}

                {/* 5: Welcome / mobile entry */}
                <div className="screen-inner" data-frame="5"><div className="scr-pad">
                  <div className="cashlo-logo sm"><img src={logo} alt="Cashlo" /></div>
                  <div style={{textAlign: 'center', marginTop: '8px', fontWeight: '800', fontSize: '14px'}}>Welcome Back</div>
                  <div style={{textAlign: 'center', fontSize: '10.5px', color: 'var(--muted)'}}>Sign in to continue securely</div>
                  <div className="tab-row"><div className="tab active">Merchant Login</div><div className="tab">Staff Login</div></div>
                  <div className="field-label">Mobile number</div>
                  <div className="field">📞 +91 &nbsp; <span style={{color: 'var(--muted)'}}>10-digit mobile number</span></div>
                  <div className="btn" style={{marginTop: '12px', opacity: '0.5'}}>Get OTP</div>
                  <div className="bio-row"><div className="bio-circ">🔐</div><div className="bio-circ">🙂</div></div>
                </div></div>

                {/* 6: Number filled */}
                <div className="screen-inner" data-frame="6"><div className="scr-pad">
                  <div className="cashlo-logo sm"><img src={logo} alt="Cashlo" /></div>
                  <div style={{textAlign: 'center', marginTop: '8px', fontWeight: '800', fontSize: '14px'}}>Welcome Back</div>
                  <div className="tab-row"><div className="tab active">Merchant Login</div><div className="tab">Staff Login</div></div>
                  <div className="field-label">Mobile number</div>
                  <div className="field">📞 +91 &nbsp; <b>98765 43210</b></div>
                  <div className="btn" style={{marginTop: '12px'}}>Get OTP</div>
                </div></div>

                {/* 7: OTP */}
                <div className="screen-inner" data-frame="7"><div className="scr-pad" style={{textAlign: 'center', paddingTop: '70px'}}>
                  <div style={{fontWeight: '800', fontSize: '14px'}}>Verify OTP</div>
                  <div style={{fontSize: '10.5px', color: 'var(--muted)', marginTop: '4px'}}>Sent to +91 98765 43210</div>
                  <div className="otp-row"><div className="otp-box">7</div><div className="otp-box">2</div><div className="otp-box">9</div><div className="otp-box">4</div></div>
                  <span className="pill pill-green">Verifying…</span>
                </div></div>

                {/* 8: Registered */}
                <div className="screen-inner" data-frame="8"><div className="scr-pad" style={{textAlign: 'center'}}>
                  <div className="check-badge" style={{marginTop: '60px'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <div style={{fontWeight: '800', fontSize: '14px', marginTop: '14px'}}>Registration complete</div>
                  <div style={{fontSize: '10.5px', color: 'var(--muted)', marginTop: '4px'}}>Let's verify your identity next</div>
                </div></div>

                {/* ============ STEP 3: KYC (frames 9-11) ============ */}

                {/* 9: Aadhaar/PAN upload */}
                <div className="screen-inner" data-frame="9"><div className="scr-pad" style={{paddingTop: '60px'}}>
                  <div style={{fontWeight: '800', fontSize: '13px', marginBottom: '10px'}}>Upload documents</div>
                  <div className="card" style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}><div style={{width: '40px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg,#EDEFFC,#fff)', border: '1px solid var(--line)', position: 'relative', overflow: 'hidden', flexShrink: '0'}}><div style={{position: 'absolute', left: '0', right: '0', height: '2px', background: 'var(--brand)', boxShadow: '0 0 8px 2px rgba(74,85,232,0.6)'}} className="scan-anim-line"></div></div><div><div style={{fontWeight: '700', fontSize: '11.5px'}}>Aadhaar card</div><div style={{fontSize: '9.5px', color: 'var(--muted)'}}>Scanning…</div></div></div>
                  <div className="card" style={{display: 'flex', alignItems: 'center', gap: '10px'}}><div style={{width: '40px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg,#EAF3DE,#fff)', border: '1px solid var(--line)', flexShrink: '0'}}></div><div style={{flex: '1'}}><div style={{fontWeight: '700', fontSize: '11.5px'}}>PAN card</div></div><span className="pill pill-green">Uploaded</span></div>
                </div></div>

                {/* 10: KYC processing (checking eligibility) */}
                <div className="screen-inner" data-frame="10"><div className="scr-pad" style={{paddingTop: '60px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px'}}>
                    <div className="ring-check"><svg width="36" height="36"><circle cx="18" cy="18" r="14" stroke="#E4E7FA" strokeWidth="4" fill="none"/><circle className="ring-arc" cx="18" cy="18" r="14" stroke="#445EF1" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="88" strokeDashoffset="20"/></svg></div>
                    <div><div style={{fontWeight: '800', fontSize: '13px'}}>Checking eligibility…</div><div style={{fontSize: '10px', color: 'var(--muted)'}}>This usually takes a few seconds</div></div>
                  </div>
                  <div className="kyc-row" id="kycRow0"><div className="kyc-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div><div style={{fontWeight: '700', fontSize: '11.5px'}}>PAN verified with NSDL</div><div style={{fontSize: '9.5px', color: 'var(--muted)'}}>ABCDE1234F</div></div></div>
                  <div className="kyc-row" id="kycRow1"><div className="kyc-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div><div style={{fontWeight: '700', fontSize: '11.5px'}}>Aadhaar e-KYC verified</div><div style={{fontSize: '9.5px', color: 'var(--muted)'}}>XXXX XXXX 7529</div></div></div>
                  <div className="kyc-row pending" id="kycRow2"><div className="kyc-icon wait">⏱</div><div><div style={{fontWeight: '700', fontSize: '11.5px', color: 'var(--muted)'}}>Credit score fetched</div><div style={{fontSize: '9.5px', color: 'var(--muted)'}}>CIBIL 742 · Good</div></div></div>
                </div></div>

                {/* 11: KYC verified */}
                <div className="screen-inner" data-frame="11"><div className="scr-pad" style={{textAlign: 'center'}}>
                  <div className="check-badge" style={{marginTop: '44px'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <div style={{fontWeight: '800', fontSize: '14px', marginTop: '14px'}}>KYC verified</div>
                  <div style={{fontSize: '10.5px', color: 'var(--muted)', marginTop: '4px'}}>You're eligible for all Cashlo services</div>
                </div></div>

                {/* ============ STEP 4: ACTIVATE & EARN (frames 12-22) ============ */}

                {/* 12: Safety rules / activation gate */}
                <div className="screen-inner" data-frame="12">
                  <div className="scr-header"><div className="back">←</div><div className="title">UPI Cash Point</div></div>
                  <div className="scr-body-under-header" style={{overflowY: 'auto'}}>
                    <div className="safety-banner"><span className="pill" style={{background: 'rgba(255,255,255,0.2)', color: '#fff'}}>🛡 SAFETY FIRST</span><div style={{fontWeight: '800', fontSize: '13.5px', marginTop: '8px'}}>Important rules before cash withdrawal</div></div>
                    <div className="rule-card red"><div className="rule-ic red">1</div><div><span className="pill pill-red">FRAUD RISK</span><div style={{fontWeight: '700', fontSize: '11px', marginTop: '3px'}}>Never reuse a screenshotted QR</div></div></div>
                    <div className="rule-card blue"><div className="rule-ic blue">2</div><div><div style={{fontWeight: '700', fontSize: '11px'}}>Maintain a withdrawal register</div></div></div>
                    <div className="btn" style={{marginTop: '12px'}}>I Understand &amp; Continue</div>
                  </div>
                </div>

                {/* 13: Services activated */}
                <div className="screen-inner" data-frame="13"><div className="scr-pad" style={{textAlign: 'center'}}>
                  <div className="check-badge" style={{marginTop: '30px'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <div style={{fontWeight: '800', fontSize: '14px', marginTop: '14px'}}>Services activated</div>
                  <div style={{display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap'}}><span className="pill pill-brand">UPI Cash Point</span><span className="pill pill-brand">QR Collect</span><span className="pill pill-brand">Recharge</span></div>
                </div></div>

                {/* 14: QR generated */}
                <div className="screen-inner" data-frame="14">
                  <div className="scr-header"><div className="back">←</div><div className="title">Collect Via QR</div></div>
                  <div className="scr-body-under-header" style={{background: 'var(--brand-grad)', height: 'calc(100% - 74px)', marginTop: '-14px', textAlign: 'center', color: '#fff'}}>
                    <div className="qr-tabs"><span className="qr-tab">BHIM»</span><span className="qr-tab">UPI»</span><span className="qr-tab">Jio Bank</span></div>
                    <div style={{marginTop: '10px', fontWeight: '700', fontSize: '12px'}}>Generating QR…</div>
                    <div className="qr-box" style={{opacity: '0.3'}}><div className="qr-grid" id="qrGridGen"></div></div>
                  </div>
                </div>

                {/* 15: QR active / waiting */}
                <div className="screen-inner" data-frame="15">
                  <div className="scr-header"><div className="back">←</div><div className="title">Collect Via QR</div></div>
                  <div className="scr-body-under-header" style={{background: 'var(--brand-grad)', height: 'calc(100% - 74px)', marginTop: '-14px', textAlign: 'center', color: '#fff'}}>
                    <div className="qr-tabs"><span className="qr-tab">BHIM»</span><span className="qr-tab">UPI»</span><span className="qr-tab">Jio Bank</span></div>
                    <div style={{marginTop: '10px', fontWeight: '700', fontSize: '12px'}}>Scan &amp; Pay</div>
                    <div style={{fontFamily: '\'Space Grotesk\',sans-serif', fontWeight: '800', fontSize: '24px'}}>₹1,000</div>
                    <div className="qr-box"><div className="qr-grid" id="qrGrid"></div><div className="qr-center"><img src={logo} alt="" /></div></div>
                    <div style={{fontWeight: '700', fontSize: '11px'}}>Sanjeev Kumar</div>
                    <div className="pill" style={{background: 'rgba(255,255,255,0.18)', color: '#fff', marginTop: '10px'}}>● Waiting for payment…</div>
                  </div>
                </div>

                {/* 16: Customer scans */}
                <div className="screen-inner" data-frame="16">
                  <div className="scr-header"><div className="back">←</div><div className="title">Collect Via QR</div></div>
                  <div className="scr-body-under-header" style={{background: 'var(--brand-grad)', height: 'calc(100% - 74px)', marginTop: '-14px', textAlign: 'center', color: '#fff'}}>
                    <div style={{marginTop: '20px', fontWeight: '700', fontSize: '12px'}}>Scan &amp; Pay</div>
                    <div style={{fontFamily: '\'Space Grotesk\',sans-serif', fontWeight: '800', fontSize: '24px'}}>₹1,000</div>
                    <div className="qr-box"><div className="qr-grid" id="qrGrid2"></div><div className="qr-center"><img src={logo} alt="" /></div><div className="scan-beam beam-anim" style={{top: '30%'}}></div></div>
                    <div className="pill" style={{background: 'rgba(255,255,255,0.18)', color: '#fff'}}>● Customer is paying…</div>
                  </div>
                </div>

                {/* 17: Payment success + voice toast */}
                <div className="screen-inner" data-frame="17"><div className="scr-pad" style={{textAlign: 'center', position: 'relative'}}>
                  <div className="toast toast-anim"><span>🔊</span><span>Payment received ₹1,000</span></div>
                  <div className="check-badge" style={{marginTop: '80px'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <div style={{fontWeight: '800', fontSize: '15px', marginTop: '14px'}}>Payment received</div>
                  <div className="receipt-amt" id="payAmt">₹0</div>
                </div></div>

                {/* 18: Cash Point withdrawal */}
                <div className="screen-inner" data-frame="18">
                  <div className="scr-header"><div className="back">←</div><div className="title">UPI Cash Point</div></div>
                  <div className="scr-body-under-header" style={{overflowY: 'auto'}}>
                    <div className="safety-banner"><div style={{fontWeight: '800', fontSize: '12.5px'}}>Cash withdrawal QR</div><div style={{fontSize: '9.5px', opacity: '0.85', marginTop: '2px'}}>Customer scans, pays you, you hand over cash</div></div>
                    <div style={{fontWeight: '700', fontSize: '10.5px', margin: '10px 0 6px'}}>Cash amount customer needs</div>
                    <div className="amt-box">₹1,000</div>
                    <div className="chip-row"><span className="chip active">₹1,000</span><span className="chip">₹2,000</span><span className="chip">₹5,000</span></div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '12px'}}>
                      <div className="limit-tile" style={{background: 'var(--brand)'}}><span className="limit-num">₹5,000</span>Per txn</div>
                      <div className="limit-tile" style={{background: '#1FA24A'}}><span className="limit-num">₹10,000</span>Per day</div>
                      <div className="limit-tile" style={{background: '#F2A93B'}}><span className="limit-num">₹50,000</span>Monthly</div>
                    </div>
                    <div className="btn" style={{marginTop: '12px'}}>Hand over cash</div>
                  </div>
                </div>

                {/* 19: Commission earned */}
                <div className="screen-inner" data-frame="19"><div className="scr-pad" style={{textAlign: 'center'}}>
                  <div className="check-badge" style={{marginTop: '34px'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <div style={{fontWeight: '800', fontSize: '14px', marginTop: '12px'}}>Cash handed over</div>
                  <div style={{fontSize: '10.5px', color: 'var(--muted)', marginTop: '10px'}}>Commission earned</div>
                  <div className="receipt-amt" id="commAmt" style={{color: 'var(--brand-deep)'}}>₹0</div>
                </div></div>

                {/* 20: Transaction complete / receipt */}
                <div className="screen-inner" data-frame="20"><div className="scr-pad" style={{paddingTop: '16px'}}>
                  <div className="receipt">
                    <div className="cashlo-logo tiny"><img src={logo} alt="Cashlo" /></div>
                    <div className="check-badge" style={{width: '36px', height: '36px', margin: '8px auto 4px'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1FA24A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                    <div style={{textAlign: 'center', fontWeight: '700', fontSize: '10.5px', color: 'var(--success)'}}>Transaction Completed</div>
                    <div className="receipt-amt">₹1,000</div>
                    <div className="dashed"></div>
                    <div className="receipt-row"><span>Customer</span><b>Vikas Sharma</b></div>
                    <div className="receipt-row"><span>Service</span><b>UPI Cash Point</b></div>
                    <div className="receipt-row"><span>Wallet balance</span><b id="walletBal">₹0</b></div>
                    <div className="dashed"></div>
                    <div style={{textAlign: 'center', fontSize: '9px', color: 'var(--muted)'}}>Thank you for using Cashlo</div>
                  </div>
                </div></div>

                {/* 21: Full dashboard */}
                <div className="screen-inner" data-frame="21"><div className="scr-pad">
                  <div className="bal-card"><div style={{fontSize: '10px', opacity: '0.85'}}>Wallet balance</div><div style={{fontFamily: '\'Space Grotesk\',sans-serif', fontWeight: '800', fontSize: '22px'}}>₹21,000</div></div>
                  <div className="svc-grid">
                    <div className="svc-tile"><div className="ic">₹</div>Cash Point</div>
                    <div className="svc-tile"><div className="ic">▦</div>QR Collect</div>
                    <div className="svc-tile"><div className="ic">↻</div>Recharge</div>
                    <div className="svc-tile"><div className="ic">⚡</div>Bill pay</div>
                    <div className="svc-tile"><div className="ic">✎</div>Khata</div>
                    <div className="svc-tile"><div className="ic">%</div>GST</div>
                  </div>
                </div></div>

                {/* 22: Closing polish */}
                <div className="screen-inner" data-frame="22"><div className="scr-pad" style={{textAlign: 'center'}}>
                  <div className="cashlo-logo" style={{marginTop: '56px'}}><img src={logo} alt="Cashlo" style={{height: '32px'}} /></div>
                  <div style={{fontSize: '11px', color: 'var(--muted)', marginTop: '10px'}}>One app. Every service. Every rupee tracked.</div>
                </div></div>

              </div>
              <div className="phone-reflection"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
    </div>
  );
}