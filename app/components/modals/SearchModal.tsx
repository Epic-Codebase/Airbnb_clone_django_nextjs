'use client';

import Modal from "./Modal";
import useSearchModal from "@/app/hooks/useSearchModal";
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";
import { useState } from "react";
import CustomButton from "../forms/CustomButton";
import { Range } from "react-date-range";
import DatePicker from "../forms/Calendar";
import { SearchQuery } from "@/app/hooks/useSearchModal";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

const SearchModal = () => {
    let content = (<></>);
    const searchModal = useSearchModal();
    const [numGuests, setNumGuests] = useState<string>('1');
    const [numBedrooms, setNumBedrooms] = useState<string>('0');
    const [numBathrooms, setNumBathrooms] = useState<string>('0');
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const [country, setCountry] = useState<SelectCountryValue>();

    const closeAndSearch = () => {
        const newSearchQuery: SearchQuery = {
            country: country?.label,
            checkIn: dateRange.startDate,
            checkOut: dateRange.endDate,
            guests: parseInt(numGuests),
            bedrooms: parseInt(numBedrooms),
            bathrooms: parseInt(numBathrooms),
            category: '',
        }

        searchModal.setQuery(newSearchQuery);
        searchModal.close();
    }

    const _setDateRange = (selection: Range) => {
        if (searchModal.step === "checkin") {
            searchModal.open('checkout');
        } else if (searchModal.step === "checkout") {
            searchModal.open('details');
        }

        setDateRange(selection);
    }

    const contentLocation = (
        <>
            <h2 className="mb-6 text-2xl">Where do you want to go?</h2>

            <SelectCountry 
                value={country}
                onChange={(value) => setCountry(value as SelectCountryValue)}
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="Check in date ->"
                    onClick={() => searchModal.open('checkin')}
                    className="flex-1"
                />
            </div>
        </>
    )

    const contentCheckin = (
        <>
            <h2 className="mb-6 text-2xl">When do you want to check in?</h2>

            <DatePicker 
                value={dateRange}
                onChange={(value) => _setDateRange(value.selection as Range)}
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="Location"
                    onClick={() => searchModal.open('location')}
                    className="flex-1"
                />
                
                <CustomButton
                    label="Check out date ->"
                    onClick={() => searchModal.open('checkout')}
                    className="flex-1"
                />                
            </div>
        </>
    )

    const contentCheckout = (
        <>
            <h2 className="mb-6 text-2xl">When do you want to check out?</h2>

            <DatePicker 
                value={dateRange}
                onChange={(value) => _setDateRange(value.selection as Range)}
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="<- Check in date"
                    onClick={() => searchModal.open('checkin')}
                    className="flex-1"
                />
                
                <CustomButton
                    label="Details"
                    onClick={() => searchModal.open('details')}
                    className="flex-1"
                />                
            </div>
        </>
    )

    const contentDetails = (
        <>
            <h2 className="mb-6 text-2xl">Details</h2>

            <div className="space-y-4">
                <div className="space-y-4">
                    <label htmlFor="">Number of guests:</label>
                    <input 
                        type="number" 
                        min="1" 
                        value={numGuests} 
                        onChange={(e) => setNumGuests(e.target.value)} 
                        className="w-full h-14 px-4 border border-gray-300 rounded-xl"
                    />
                </div>

                <div className="space-y-4">
                    <label htmlFor="">Number of bedrooms:</label>
                    <input 
                        type="number" 
                        min="0" 
                        value={numBedrooms} 
                        onChange={(e) => setNumBedrooms(e.target.value)} 
                        className="w-full h-14 px-4 border border-gray-300 rounded-xl"
                    />
                </div>

                <div className="space-y-4">
                    <label htmlFor="">Number of bathrooms:</label>
                    <input 
                        type="number" 
                        min="0" 
                        value={numBathrooms} 
                        onChange={(e) => setNumBathrooms(e.target.value)} 
                        className="w-full h-14 px-4 border border-gray-300 rounded-xl"
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="<- Check out date"
                    onClick={() => searchModal.open('<- Check out date')}
                    className="flex-1"
                />
                
                <CustomButton
                    label="Search"
                    onClick={closeAndSearch}
                    className="flex-1"
                />                
            </div>
        </>
    )

    if (searchModal.step == 'location') {
        content = contentLocation;
    } else if (searchModal.step == 'checkin') {
        content = contentCheckin;
    } else if (searchModal.step == 'checkout') {
        content = contentCheckout;
    } else if (searchModal.step == 'details') {
        content = contentDetails;
    }

    return (
        <Modal 
            isOpen={searchModal.isOpen}
            close={searchModal.close}
            label="Search"
            content={content}
        />
    )
}

export default SearchModal;