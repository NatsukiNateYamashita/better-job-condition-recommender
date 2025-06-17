import { Search, Bell, Settings, User, Grid3X3, ChevronDown, Cloud } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      {/* Top Header Bar */}
      <div className="px-4 py-2 bg-white">
        <div className="flex items-center">
          {/* 左側ロゴ */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Cloud className="w-12 h-12 text-sky-600 fill-sky-600" />
            </div>
          </div>
          {/* 中央 検索窓 */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="検索..."
                className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 w-full bg-white"
              />
            </div>
          </div>
          {/* 右側アイコン */}
          <div className="flex items-center gap-2 ml-4">
            <button className="p-1.5 text-gray-700 hover:bg-sky-600 rounded-md">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-700 hover:bg-sky-600 rounded-md">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-6 h-6 bg-sky-700 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-700">山下 夏輝</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="px-4 py-2 bg-white">
        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700 font-bold text-lg">HAYABUSA Lightning</span>
          </div>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-sky-600 bg-sky-50 rounded-md hover:bg-sky-100 transition-colors">
            ホーム
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors">
            Chatter
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors">
            ジョブ検索
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors">
            キャンディデート検索
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors">
            クライアント
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors">
            キャンディデイト/クライアント
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors">
            ジョブ
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors">
            マッチングパイプライン
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors">
            さらに表示
            <ChevronDown className="w-3 h-3" />
          </button>
        </nav>
      </div>

      {/* Page Title Section */}
      <div className="border-t-2 border-sky-600 px-6 py-4 bg-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">求人条件最適化ツール</h1>
            <p className="text-gray-700 text-sm mt-1">人材プール照合による最適な求人条件の提案</p>
          </div>
        </div>
      </div>
    </header>
  );
}
