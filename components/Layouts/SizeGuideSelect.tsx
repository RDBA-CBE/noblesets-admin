import { formatOptions, useSetState } from '@/utils/functions';
import React, { useEffect } from 'react';
import Select from 'react-select';

export default function SizeGuideSelect({
    queryFunc,
    placeholder = 'Select Size Guide',
    selectedCategory, 
    onCategoryChange, 
    initialFetchParams = { first: 20, query: '', channel: 'india-channel' }, 
    isMulti = false, // ✅ Set to false for single-select
    clearable = true,
    title = '',
}) {
    const [state, setState] = useSetState({
        catOption: [],
        hasNext: false,
        after: null,
        searchInput: '',
    });

    useEffect(() => {
        categoryList();
    }, []);

    const categoryList = async (query = '', after = null) => {
        const res = await queryFunc({ ...initialFetchParams, after, query });
        const formattedOptions = formatOptions(res?.data?.sizeGuids?.edges); 
        const pageInfo = res?.data?.sizeGuids?.pageInfo;
        setState({
            catOption: after ? [...state.catOption, ...formattedOptions] : formattedOptions,
            hasNext: pageInfo?.hasNextPage,
            after: pageInfo?.endCursor,
        });
    };

    const handleMenuScrollToBottom = async () => {
        if (state.hasNext) {
            categoryList(state.searchInput, state.after);
        }
    };

    const getProductSearch = async (inputValue) => {
        setState({ searchInput: inputValue });
        categoryList(inputValue);
    };

    const handleCategoryChange = (selected) => {
        onCategoryChange(selected);
        categoryList(); // refresh the list
    };

    return (
        <div>
            {title && (
                <label className="block text-lg font-medium text-gray-700">
                    {title || 'Size Guide'}
                </label>
            )}
            <Select
                placeholder={placeholder}
                options={state.catOption}
                value={selectedCategory}
                onChange={handleCategoryChange}
                isSearchable={true}
                isMulti={false} // ✅ Single-select mode
                isLoading={false}
                onInputChange={(inputValue, { action }) => {
                    if (action === 'input-change') {
                        getProductSearch(inputValue);
                    }
                }}
                onMenuScrollToBottom={handleMenuScrollToBottom}
                isClearable={clearable}
                closeMenuOnSelect={true} // Close after select
                blurInputOnSelect={false}
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
            />
        </div>
    );
}
