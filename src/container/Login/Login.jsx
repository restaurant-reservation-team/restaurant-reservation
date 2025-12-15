import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [mode, setMode] = useState('login'); // "login" or "register"

  return (
    <section className="app__login section__padding" id="login">
      <div className="app__login-wrapper">
        {/* LEFT SIDE – TEXT */}
        <div className="app__login-side">
          <h3 className="app__login-subtitle">Minimum Najjaci Kafić U Gradu</h3>
          <h1 className="app__login-title">Welcome Back</h1>
          <p className="app__login-text">
            Log in or create an account to book a table, save your favourite dishes
            and get special offers from our restaurant.
          </p>
        </div>

        {/* RIGHT SIDE – CARD */}
        <div className="app__login-card">
          <div className="app__login-tabs">
            <button
              className={`app__login-tab ${mode === 'login' ? 'active' : ''}`}
              type="button"
              onClick={() => setMode('login')}
            >
              Log In
            </button>
            <button
              className={`app__login-tab ${mode === 'register' ? 'active' : ''}`}
              type="button"
              onClick={() => setMode('register')}
            >
              Registration
            </button>
          </div>

          <form
            className="app__login-form"
            onSubmit={(e) => {
              e.preventDefault();
              // later connect to backend / context
              console.log(`${mode} form submitted`);
            }}
          >
            {mode === 'register' && (
              <div className="app__login-field">
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" placeholder="Your name" />
              </div>
            )}

            <div className="app__login-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="app__login-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="••••••••" />
            </div>

            {mode === 'register' && (
              <div className="app__login-field">
                <label htmlFor="confirm">Confirm password</label>
                <input id="confirm" type="password" placeholder="Repeat password" />
              </div>
            )}

            {mode === 'login' && (
              <div className="app__login-footerRow">
                <label className="app__login-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="app__login-link">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="custom__button app__login-submit">
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </button>

            
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
