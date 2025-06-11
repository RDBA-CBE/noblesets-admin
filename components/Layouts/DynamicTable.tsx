import { Failure } from '@/utils/functions';
import React, { useEffect, useState } from 'react';

export default function DynamicSizeTable(props) {
    const { htmlTableString, tableData } = props;
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [tableInitialized, setTableInitialized] = useState(false);
  

    useEffect(() => {
        if (htmlTableString) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlTableString, 'text/html');
            const table = doc.querySelector('table');

            if (table) {
                const headers = Array.from(table.querySelectorAll('thead th')).map((th) => th.textContent.trim());

                const rowElements = table.querySelectorAll('tbody tr');
                const parsedRows = Array.from(rowElements).map((tr) => {
                    const cells = tr.querySelectorAll('td');
                    const rowObj = {};
                    headers.forEach((header, index) => {
                        rowObj[header] = cells[index]?.textContent?.trim() || '';
                    });
                    return rowObj;
                });

                setColumns(headers);
                setRows(parsedRows);
                setTableInitialized(true);
            }
        } else {
            // Optionally reset the state if htmlTableString is null or empty
            setColumns([]);
            setRows([]);
            setTableInitialized(false);
        }
    }, [htmlTableString]);

    const createTable = () => {
        const heading = prompt('Enter first heading (e.g., Size):');
        if (heading) {
            setColumns([heading]);
            setRows([{ [heading]: '' }]);
            setTableInitialized(true);
        }
    };

    const addColumn = () => {
        const newCol = prompt('Enter column name:');
        if (newCol && !columns.includes(newCol)) {
            setColumns([...columns, newCol]);
            setRows(rows.map((row) => ({ ...row, [newCol]: '' })));
        }
    };

    const addRow = () => {
        const newRow = {};
        columns.forEach((col) => (newRow[col] = ''));
        setRows([...rows, newRow]);
    };

    const deleteRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };

    const deleteColumn = (colIndex) => {
        const colName = columns[colIndex];
        const updatedColumns = [...columns];
        updatedColumns.splice(colIndex, 1);
        setColumns(updatedColumns);
        setRows(
            rows.map((row) => {
                const newRow = { ...row };
                delete newRow[colName];
                return newRow;
            })
        );
    };

    const editColumn = (colIndex) => {
        const oldCol = columns[colIndex];
        const newCol = prompt('Enter new column name:', oldCol);

        if (newCol && newCol !== oldCol && !columns.includes(newCol)) {
            const updatedColumns = [...columns];
            updatedColumns[colIndex] = newCol;
            setColumns(updatedColumns);

            const updatedRows = rows.map((row) => {
                const newRow = { ...row };
                newRow[newCol] = newRow[oldCol];
                delete newRow[oldCol];
                return newRow;
            });

            setRows(updatedRows);
        }
    };

    const handleChange = (rowIndex, key, value) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex][key] = value;
        setRows(updatedRows);
    };

    const handleSubmit = () => {
        const hasEmptyCells = rows.some((row) => columns.some((col) => !row[col] || row[col].trim() === ''));
        if (columns.length == 0) {
            Failure('At least column is required');
        } else if (columns.length > 0 && rows.length == 0) {
            Failure('At least one row is required if columns are added.');
        } else if (hasEmptyCells) {
            Failure('All row cells must be filled.');
        } else {
            tableData(columns, rows);
        }
    };

    const generateHTML = () => {
        const tableRows = rows.map((row) => `<tr>${columns.map((col) => `<td>${row[col] || ''}</td>`).join('')}<td></td></tr>`).join('');

        const tableHTML = `
        <table border="1" cellpadding="5" cellspacing="0">
            <thead>
                <tr>
                    ${columns.map((col) => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>`;

        alert('Generated HTML:\n\n' + tableHTML);
    };

    return (
        <div className="p-2">
            {!tableInitialized ? (
                <button onClick={createTable} className="rounded bg-blue-600 px-4 py-2 text-white">
                    Create Table
                </button>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-max border border-gray-500">
                            <thead>
                                <tr>
                                    {columns.map((col, colIndex) => (
                                        <th key={col} className="relative items-center border p-2">
                                            {col}
                                            <div className="absolute right-0 right-5 top-2 flex items-center justify-center gap-1 gap-4 p-1">
                                                <button onClick={() => editColumn(colIndex)} className="text-xs text-blue-600" title="Edit Column">
                                                    ✏️
                                                </button>
                                                <button onClick={() => deleteColumn(colIndex)} className="text-xs text-red-600" title="Delete Column">
                                                    ❌
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                    {(columns?.length > 0 || rows?.length > 0) && <th className="border p-2">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map((col) => (
                                            <td key={col} className="border p-2">
                                                <input value={row[col]} onChange={(e) => handleChange(rowIndex, col, e.target.value)} className="w-full border p-1" />
                                            </td>
                                        ))}
                                        <td className="border p-2 text-center">
                                            <button onClick={() => deleteRow(rowIndex)} className="text-sm text-red-600" title="Delete Row">
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-4 mt-4 flex justify-between space-x-2">
                        <div>{<p className="error-message mt-1 text-blue-500 ">Fill the column values and then click the submit button to update the data</p>}</div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={addColumn} className="rounded bg-blue-500 px-3 py-1 text-white">
                                Add Column
                            </button>
                            <button onClick={addRow} className="rounded bg-green-500 px-3 py-1 text-white">
                                Add Rows
                            </button>
                            <button onClick={() => handleSubmit()} className="rounded bg-[#c2882b]  px-3 py-1 text-white">
                                Submit
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
