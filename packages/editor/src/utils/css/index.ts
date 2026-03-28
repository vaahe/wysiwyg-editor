export type ClassValue = string | false | null | undefined;

export class CssUtils {
  static setClasses = (classes: ClassValue[]) => {
    return classes.filter(Boolean).join(" ");
  }
}