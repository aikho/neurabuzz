let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let timeFormat = 'us';

// All IANA timezones with UTC offsets
const timezones = [
    'Pacific/Midway', 'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles', 
    'America/Denver', 'America/Chicago', 'America/New_York', 'America/Caracas',
    'America/Santiago', 'America/Sao_Paulo', 'America/Argentina/Buenos_Aires',
    'Atlantic/Cape_Verde', 'UTC', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'Europe/Athens', 'Europe/Helsinki', 'Europe/Moscow', 'Africa/Cairo',
    'Africa/Johannesburg', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata',
    'Asia/Dhaka', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Singapore', 'Asia/Hong_Kong',
    'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney',
    'Australia/Melbourne', 'Pacific/Auckland', 'Pacific/Fiji',
    'America/Mexico_City', 'America/Bogota', 'America/Lima', 'America/Guatemala',
    'America/Havana', 'America/Toronto', 'America/Vancouver', 'America/Edmonton',
    'America/Winnipeg', 'America/Halifax', 'America/Phoenix', 'America/Mazatlan',
    'America/Costa_Rica', 'America/Panama', 'America/Managua', 'America/Tegucigalpa',
    'America/Jamaica', 'America/Port-au-Prince', 'America/Santo_Domingo',
    'America/La_Paz', 'America/Guayaquil', 'America/Asuncion', 'America/Montevideo',
    'Europe/Dublin', 'Europe/Lisbon', 'Europe/Madrid', 'Europe/Rome',
    'Europe/Brussels', 'Europe/Amsterdam', 'Europe/Zurich', 'Europe/Vienna',
    'Europe/Prague', 'Europe/Warsaw', 'Europe/Budapest', 'Europe/Stockholm',
    'Europe/Oslo', 'Europe/Copenhagen', 'Europe/Bucharest', 'Europe/Istanbul',
    'Europe/Kiev', 'Europe/Minsk', 'Asia/Jerusalem', 'Asia/Beirut', 'Asia/Amman',
    'Asia/Baghdad', 'Asia/Kuwait', 'Asia/Riyadh', 'Asia/Qatar', 'Asia/Bahrain',
    'Asia/Muscat', 'Asia/Tehran', 'Asia/Baku', 'Asia/Tbilisi', 'Asia/Yerevan',
    'Asia/Kabul', 'Asia/Tashkent', 'Asia/Almaty', 'Asia/Colombo', 'Asia/Kathmandu',
    'Asia/Yangon', 'Asia/Phnom_Penh', 'Asia/Vientiane', 'Asia/Kuala_Lumpur',
    'Asia/Manila', 'Asia/Taipei', 'Asia/Macau', 'Asia/Ulaanbaatar',
    'Australia/Perth', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Hobart',
    'Pacific/Guam', 'Pacific/Port_Moresby', 'Pacific/Noumea', 'Pacific/Tongatapu'
];

// Initialize timezone dropdown
function initializeTimezoneDropdown() {
    const select = document.getElementById('timezone_select');
    
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        
        // Get UTC offset
        const offset = getUTCOffset(tz);
        const cityName = tz.split('/').pop().replace(/_/g, ' ');
        
        option.textContent = `${cityName} (UTC${offset})`;
        select.appendChild(option);
        
        // Set current timezone as selected
        if (tz === currentTimezone) {
            option.selected = true;
        }
    });
}

function getUTCOffset(timezone) {
    const date = newsCheckedUTC;
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate - utcDate) / (1000 * 60 * 60);
    
    if (offset === 0) return '';
    const sign = offset > 0 ? '+' : '';
    const hours = Math.floor(Math.abs(offset));
    const minutes = Math.abs(offset) % 1 * 60;
    
    if (minutes === 0) {
        return `${sign}${offset}`;
    } else {
        return `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
    }
}

// Initialize
initializeTimezoneDropdown();
updateTimeDisplay();

// Handle timezone change
document.getElementById('timezone_select').addEventListener('change', function() {
    currentTimezone = this.value;
    updateTimeDisplay();
});

// Handle time format change
document.getElementById('time_format').addEventListener('change', function() {
    timeFormat = this.value;
    updateTimeDisplay();
});

function updateTimeDisplay() {
    const timeElement = document.getElementById('news_time');
    
    if (timeFormat === 'us') {
        // MM/dd/yyyy 12-hour format
        const month = newsCheckedUTC.toLocaleString('en-US', { 
            month: '2-digit', 
            timeZone: currentTimezone 
        });
        const day = newsCheckedUTC.toLocaleString('en-US', { 
            day: '2-digit', 
            timeZone: currentTimezone 
        });
        const year = newsCheckedUTC.toLocaleString('en-US', { 
            year: 'numeric', 
            timeZone: currentTimezone 
        });
        const time = newsCheckedUTC.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: currentTimezone
        });
        timeElement.textContent = `${month}/${day}/${year} ${time}`;
    } else {
        // DD.MM.yyyy 24-hour format
        const day = newsCheckedUTC.toLocaleString('en-US', { 
            day: '2-digit', 
            timeZone: currentTimezone 
        });
        const month = newsCheckedUTC.toLocaleString('en-US', { 
            month: '2-digit', 
            timeZone: currentTimezone 
        });
        const year = newsCheckedUTC.toLocaleString('en-US', { 
            year: 'numeric', 
            timeZone: currentTimezone 
        });
        const hour = newsCheckedUTC.toLocaleString('en-US', {
            hour: '2-digit',
            hour12: false,
            timeZone: currentTimezone
        });
        const minute = newsCheckedUTC.toLocaleString('en-US', {
            minute: '2-digit',
            timeZone: currentTimezone
        });
        timeElement.textContent = `${day}.${month}.${year} ${hour}:${minute}`;
    }
}