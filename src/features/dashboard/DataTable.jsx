/**
 * DataTable
 *
 * Reusable responsive table used across all three dashboards.
 *
 * Props:
 *   columns  — [{ key, label, render?, className?, hideOnMobile? }]
 *   rows     — array of data objects
 *   emptyMsg — message when rows is empty
 *   loading  — show skeleton rows
 */
const DataTable = ({ columns = [], rows = [], emptyMsg = 'No data found', loading = false }) => (
  <div className="table-responsive">
    <table className="table table-hover align-middle mb-0" role="table">
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {columns.map(col => (
            <th
              key={col.key}
              className={`border-0 fw-semibold small text-muted py-3 ${col.hideOnMobile ? 'd-none d-md-table-cell' : ''} ${col.className || ''}`}
              style={{ fontSize: '0.78rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <tr key={i}>
            {columns.map(col => (
              <td key={col.key} className={col.hideOnMobile ? 'd-none d-md-table-cell' : ''}>
                <div className="placeholder-glow">
                  <span className="placeholder col-8 rounded" />
                </div>
              </td>
            ))}
          </tr>
        ))}

        {!loading && rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-2 d-block mb-2" aria-hidden="true" />
              {emptyMsg}
            </td>
          </tr>
        )}

        {!loading && rows.map((row, i) => (
          <tr key={row.id || i}>
            {columns.map(col => (
              <td
                key={col.key}
                className={`${col.hideOnMobile ? 'd-none d-md-table-cell' : ''} ${col.className || ''}`}
              >
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default DataTable
