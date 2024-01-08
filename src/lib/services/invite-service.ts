import { scopedLogger } from "../utils/logger";

const logger = scopedLogger("InviteService");

class InviteService {
  static storageKey: "inviteCode" = "inviteCode";

  key(): string {
    return InviteService.storageKey;
  }

  clearInviteCode() {
    localStorage.removeItem(this.key());
  }

  // immediately store the invite code if it exists, since we are trying to force the user to install the app
  // on the login page. this way we have access to the code later on if by installing the app we lose the query param
  storeInviteCode() {
    const params = new URLSearchParams(window.location.href.split("?")[1]);

    if (
      !params.has("invite") ||
      params.get("invite") === null ||
      params.get("invite")!.trim().length === 0
    ) {
      logger("no invite code found");
      return;
    }

    localStorage.setItem(this.key(), params.get("invite")!);
  }

  manuallyStoreCode(code: string) {
    localStorage.setItem(this.key(), code);
  }

  hasInviteCode(): boolean {
    return !!localStorage.getItem(this.key());
  }

  code(): string | null {
    return localStorage.getItem(this.key());
  }
}

const inviteService = new InviteService();

export default inviteService;
