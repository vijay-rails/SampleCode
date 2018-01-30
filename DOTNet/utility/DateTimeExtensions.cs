using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesforceIntegration
{
    public static class DateTimeExtensions
    {
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = dt.DayOfWeek - startOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return dt.AddDays(-1 * diff).Date;
        }
        public static DateTime StartOfMonth(this DateTime dt, DayOfWeek startOfWeek)
        {
            DateTime currentMonth = new DateTime(dt.Year, dt.Month, 1);
            return currentMonth.AddDays((startOfWeek < currentMonth.DayOfWeek ? 7 : 0) + startOfWeek - currentMonth.DayOfWeek);
        }
        public static DateTime StartOfPreviousWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            DateTime previousWeek = dt.AddDays(-7);
            return previousWeek.StartOfWeek(DayOfWeek.Monday);
        }

        public static DateTime StartOfPreviousMonth(this DateTime dt, DayOfWeek startOfWeek)
        {
            DateTime previousMonth = dt.AddMonths(-1);
            return previousMonth.StartOfMonth(DayOfWeek.Monday);
        }
    }
}
