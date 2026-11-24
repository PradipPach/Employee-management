// Page 4: shown after logout
function LogoutPage({ onGoHome }) {
  return (
    <div className="max-w-sm mx-auto mt-16 bg-white border rounded-lg p-6 text-center">
      <h1 className="text-xl font-bold">You are logged out</h1>
      <button
        onClick={onGoHome}
        className="mt-4 bg-blue-600 text-white rounded px-4 py-2"
      >
        Back to company list
      </button>
    </div>
  );
}

export default LogoutPage;
