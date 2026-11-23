import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Header.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  const linkRefs = useRef([]);
  const { pathname } = useLocation();

  // which link matches the current page
  const activeIndex = links.findIndex((l) =>
    l.to === '/' ? pathname === '/' : pathname.startsWith(l.to)
  );
  const target = hovered ?? activeIndex;

  // move the lime pill under the hovered / active link
  const movePill = () => {
    const el = linkRefs.current[target];
    setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : { x: 0, w: 0 });
  };

  useLayoutEffect(movePill, [target]);

  useEffect(() => {
    window.addEventListener('resize', movePill);
    document.fonts?.ready.then(movePill);
    return () => window.removeEventListener('resize', movePill);
  });

  // close the menu when the page changes
  useEffect(() => setOpen(false), [pathname]);

  // lock scroll + close with Escape while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo" aria-label="Home">
          S
        </Link>

        {/* desktop nav */}
        <nav className="header-nav" onMouseLeave={() => setHovered(null)}>
          <span
            className="header-pill"
            style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
          />
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              ref={(el) => (linkRefs.current[i] = el)}
              className={`header-link ${i === target ? 'header-link--hot' : ''}`}
              onMouseEnter={() => setHovered(i)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* menu button */}
        <button
          className={`header-menu-btn ${open ? 'header-menu-btn--open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <i />
          <i />
          <i />
        </button>
      </header>

      {/* fullscreen menu */}
      <div className={`menu-overlay ${open ? 'menu-overlay--open' : ''}`} aria-hidden={!open}>
        {links.map((l, i) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className="menu-link"
            style={{ '--i': i }}
            onClick={() => setOpen(false)}
          >
            <small>{String(i + 1).padStart(2, '0')}</small>
            {l.label}
          </NavLink>
        ))}
        <p className="menu-note">Samia · UX/UI + Frontend · Portfolio 2026 — press Esc to close</p>
      </div>
    </>
  );
}