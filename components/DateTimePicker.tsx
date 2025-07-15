'use client';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function DateTimeField({
    disabled = false,
    label = '',
    placeholder = '',
    value,
    onChange,
    fromDate = null,
    error = null,
    required = false,
    className,
    max = null,
    width = '100%',
    height = '32px', // Default height
}) {
    return (
        <div className="flex flex-col" style={{ width }}>
            {label && (
                <label className="mb-2 block text-sm font-bold text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    disabled={disabled}
                    value={value ? dayjs(value) : null}
                    format="DD/MM/YYYY hh:mm A"
                    onChange={(newValue) => onChange(newValue || null)}
                    minDateTime={fromDate ? dayjs(fromDate) : undefined}
                    ampm={true}
                    sx={{
                        '& .MuiInputBase-root': {
                            width: width ? width : '100%',
                        },
                        '.css-1hgcujo-MuiPickersInputBase-root-MuiPickersOutlinedInput-root': {
                            height: height, // 👈 Directly apply the height
                        },
                    }}
                    slotProps={{
                        textField: {
                            placeholder,
                            size: 'small',
                            error: !!error,
                        },
                    }}
                    className={className} // Pass through className
                />
            </LocalizationProvider>

            {error && <span className="mt-1 text-sm font-medium text-red-500">{error}</span>}
        </div>
    );
}
