export class Setting {
  private static instance = new Setting();
  private color_themes = {
    dark: {
      background: {
        primary: "#222",
        secondary: "#445",
        accent: "#ccc"
      }, color: {
        primary: "#ccc",
        secondary: "#ccc",
        accent: "#333"
      }
    },
  };

  private active_theme;
  private color_elements = {
    primary: [],
    secondary: [],
    accent: []
  };
  static get_instance() { return Setting.instance; }
  private constructor() {
    this.active_theme = this.color_themes.dark;
  }
  load_settings(settings) {

  }
  color_primary(element: HTMLElement) {
    this.color_elements.primary.push(element)
  }
  color_secondary(element: HTMLElement) {
    this.color_elements.secondary.push(element)
  }
  color_accent(element: HTMLElement) {
    this.color_elements.accent.push(element)
  }
  on_color_theme_change() {
    for(const el of this.color_elements.primary) {
      el.style.background = this.active_theme.background.primary;
      el.style.color = this.active_theme.color.primary;
    }
    for(const el of this.color_elements.secondary) {
      el.style.background = this.active_theme.background.secondary;
      el.style.color = this.active_theme.color.secondary;
    }
    for(const el of this.color_elements.accent) {
      el.style.background = this.active_theme.background.accent;
      el.style.color = this.active_theme.color.accent;
    }
  }

}