import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1, // Monday
});

export default dayjs;
