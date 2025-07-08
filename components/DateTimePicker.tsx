'use client';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import IconClock from './Icon/IconClock';

export default function DateTimeField({ disabled = false, label = '', placeholder = '', value, onChange, fromDate = null, error = null, required = false, className, max = null }) {
    return (
        <div className="flex flex-col">
            <label className="mb-2 block text-sm font-bold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    className={className ? className : ''}
                    disabled={disabled ? disabled : false}
                    value={value ? dayjs(value) : null}
                    format="DD/MM/YYYY hh:mm A"
                    onChange={(newValue) => onChange(newValue || null)}
                    minDateTime={fromDate ? dayjs(fromDate) : undefined}
                    // maxDateTime={max ? dayjs(max) : undefined}
                    ampm={true}
                    slotProps={{
                        textField: {
                            placeholder,
                            size: 'small',
                            error: !!error,
                            fullWidth: true,
                        },
                    }}
                />
            </LocalizationProvider>

            {/* Show error message below like a label */}
            {error && <span className="mt-1 text-sm font-medium text-red-500">{error}</span>}
        </div>
    );
}
