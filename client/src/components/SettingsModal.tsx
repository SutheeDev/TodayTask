import { useEffect } from "react";
import { AppSettings } from "../hooks/useSettings";
import { RiCloseLine } from "react-icons/ri";

interface Props {
  settings: AppSettings;
  onUpdateSetting: (key: keyof AppSettings, value: number) => void;
  onClose: () => void;
}

const SettingsModal = ({ settings, onUpdateSetting, onClose }: Props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings__header">
          <h2 className="modal__title">Settings</h2>
          <button className="settings__close" onClick={onClose}>
            <RiCloseLine />
          </button>
        </div>

        <div className="settings__row">
          <span className="settings__label">Active task limit</span>
          <div className="settings__stepper">
            <button
              className="settings__stepper-btn"
              disabled={settings.maxActive <= 1}
              onClick={() => onUpdateSetting("maxActive", settings.maxActive - 1)}
            >
              &minus;
            </button>
            <span className="settings__stepper-value">{settings.maxActive}</span>
            <button
              className="settings__stepper-btn"
              disabled={settings.maxActive >= 10}
              onClick={() => onUpdateSetting("maxActive", settings.maxActive + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="settings__row">
          <span className="settings__label">Focus task limit</span>
          <div className="settings__stepper">
            <button
              className="settings__stepper-btn"
              disabled={settings.maxFocused <= 1}
              onClick={() => onUpdateSetting("maxFocused", settings.maxFocused - 1)}
            >
              &minus;
            </button>
            <span className="settings__stepper-value">{settings.maxFocused}</span>
            <button
              className="settings__stepper-btn"
              disabled={settings.maxFocused >= 3}
              onClick={() => onUpdateSetting("maxFocused", settings.maxFocused + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="settings__row">
          <span className="settings__label">Carried-over task limit</span>
          <div className="settings__stepper">
            <button
              className="settings__stepper-btn"
              disabled={settings.maxCarriedOver <= 1}
              onClick={() => onUpdateSetting("maxCarriedOver", settings.maxCarriedOver - 1)}
            >
              &minus;
            </button>
            <span className="settings__stepper-value">{settings.maxCarriedOver}</span>
            <button
              className="settings__stepper-btn"
              disabled={settings.maxCarriedOver >= Math.min(5, settings.maxActive)}
              onClick={() => onUpdateSetting("maxCarriedOver", settings.maxCarriedOver + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
