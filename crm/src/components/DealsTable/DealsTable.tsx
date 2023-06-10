import "./dealsTable.scss";
import { IDeal } from "../../types";
import { Link } from "react-router-dom";
import useTranslate from "../../hooks/useTranslate";
import { useTypedSelector } from "../../store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

type DealsTableProps = {
  userId: string;
  updateDeals: boolean;
  setUpdateDeals: Dispatch<SetStateAction<boolean>>;
};

const DealsTable = ({
  userId,
  updateDeals,
  setUpdateDeals,
}: DealsTableProps) => {
  const [deals, setDeals] = useState<Array<IDeal>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [searchResults, setSearchResults] = useState<Array<IDeal>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslate();
  const currentTheme = useTypedSelector((state) => state.theme.currentTheme);

  const getDeals = useFetch("get", `/deals/${userId}`);
  const dealsPerPage = 10;

  useEffect(() => {
    const fetchDeals = async () => {
      const fetchedDeals: Array<IDeal> = await getDeals();
      setDeals(fetchedDeals);
    };
    fetchDeals();
    if (updateDeals) {
      setUpdateDeals(false);
    }
  }, [updateDeals]);

  const searchDeals = () => {
    const filteredDeals = deals.filter((deal) => {
      const query = searchQuery.toLowerCase();
      const criteria = searchCriteria.toLowerCase();
      return deal[criteria].toString().toLowerCase().includes(query);
    });

    setSearchResults(filteredDeals);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (searchQuery || searchCriteria) {
      searchDeals();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchCriteria]);

  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = searchResults.length > 0 ? searchResults : deals;
  const currentDealsOnPage = currentDeals.slice(
    indexOfFirstDeal,
    indexOfLastDeal
  );
  const totalPages = Math.ceil(currentDeals.length / dealsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="deals-table-container">
      <div className="deals-table-head">
        <span>
          {t("numder_of_deals")}: {deals.length}
        </span>
        <div className="deals-table-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          <select
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
          >
            <option value="name">{t("name")}</option>
            <option value="email">{t("email")}</option>
            <option value="company">{t("company")}</option>
          </select>
        </div>
        <span>
          {t("numder_of_searched_deals")}:{" "}
          {(searchQuery && searchResults.length) || deals.length}
        </span>
      </div>
      <table className="deals-table">
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("email")}</th>
            <th>{t("company")}</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.length === 0 && searchQuery ? (
            <tr>
              <td colSpan={3}>{t("no_results")}</td>
            </tr>
          ) : (
            currentDealsOnPage.map((deal) => {
              return (
                <tr key={deal.id}>
                  <td>
                    <Link to={`/deals/${deal.id}`} className={currentTheme}>
                      {deal.name}
                    </Link>
                  </td>
                  <td>{deal.email}</td>
                  <td>{deal.company}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={
              `${currentTheme} ` + (number === currentPage ? "active" : "")
            }
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DealsTable;
