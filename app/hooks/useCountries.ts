import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
    label: country.name.common,
    value: country.cca2
}));

const useCountries = () => {
    const getAll = () => formattedCountries;

    const getByValue = (value: string) => {
        return formattedCountries.find((country) => country.value === value);
    };

    return {
        getAll,
        getByValue
    }
};

export default useCountries;