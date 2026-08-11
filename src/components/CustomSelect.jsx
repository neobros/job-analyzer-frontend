import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const MENU_MAX_HEIGHT = 270;

export default function CustomSelect({ icon: Icon, value, placeholder, options = [], disabled = false, onChange }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function closeOnOutside(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, []);

  function toggleOpen() {
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < MENU_MAX_HEIGHT && spaceAbove > spaceBelow);
    }
    setOpen((current) => !current);
  }

  function selectOption(option) {
    onChange?.(option.value);
    setOpen(false);
  }

  return (
    <div className={`custom-select ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`} ref={rootRef}>
      <button type="button" className="custom-select-trigger" disabled={disabled} onClick={toggleOpen}>
        {Icon ? <Icon size={18} /> : null}
        <span className={selected ? '' : 'placeholder'}>{selected?.label || placeholder}</span>
        <ChevronDown className="select-chevron" size={18} />
      </button>
      {open ? (
        <div className={`custom-select-menu ${openUp ? 'menu-up' : ''}`}>
          {options.length ? options.map((option) => (
            <button type="button" key={option.value} className={option.value === value ? 'selected' : ''} onClick={() => selectOption(option)}>
              <span>{option.label}</span>
              {option.value === value ? <Check size={16} /> : null}
            </button>
          )) : <div className="custom-select-empty">No options found</div>}
        </div>
      ) : null}
    </div>
  );
}
