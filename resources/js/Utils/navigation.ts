import { route } from "ziggy-js";

export default function getDashboardRoute(isAdmin: boolean) {
    return {
      href: isAdmin ? route('admin.dashboard') : route('dashboard'),
      active: isAdmin
        ? route().current('admin.dashboard')
        : route().current('dashboard'),
    };
  }

