'use client';

import { useState, useEffect } from 'react';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  expirationDate: string;
  quantity: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  time: string;
  difficulty: string;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: 'vegetable',
    expirationDate: '',
    quantity: ''
  });
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ingredients');
    if (saved) setIngredients(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  const getDaysUntilExpiration = (date: string) => {
    const today = new Date();
    const exp = new Date(date);
    const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getExpirationStatus = (days: number) => {
    if (days < 0) return { color: 'bg-red-500', text: '만료됨' };
    if (days <= 3) return { color: 'bg-orange-500', text: `${days}일 남음` };
    if (days <= 7) return { color: 'bg-yellow-500', text: `${days}일 남음` };
    return { color: 'bg-green-500', text: `${days}일 남음` };
  };

  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.expirationDate) return;
    
    const ingredient: Ingredient = {
      id: Date.now().toString(),
      ...newIngredient
    };
    
    setIngredients([...ingredients, ingredient]);
    setNewIngredient({ name: '', category: 'vegetable', expirationDate: '', quantity: '' });
    setShowAddModal(false);
  };

  const updateIngredient = () => {
    if (!editingIngredient) return;
    setIngredients(ingredients.map(i => i.id === editingIngredient.id ? editingIngredient : i));
    setEditingIngredient(null);
  };

  const deleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const getRecommendedRecipes = (): Recipe[] => {
    const ingredientNames = ingredients.map(i => i.name.toLowerCase());
    const allRecipes: Recipe[] = [
      {
        id: '1',
        name: '김치찌개',
        ingredients: ['김치', '두부', '돼지고기'],
        time: '30분',
        difficulty: '쉬움'
      },
      {
        id: '2',
        name: '계란말이',
        ingredients: ['계란', '파', '식용유'],
        time: '15분',
        difficulty: '쉬움'
      },
      {
        id: '3',
        name: '볶음밥',
        ingredients: ['밥', '계란', '양파', '대파'],
        time: '20분',
        difficulty: '쉬움'
      },
      {
        id: '4',
        name: '된장찌개',
        ingredients: ['된장', '두부', '감자', '양파'],
        time: '25분',
        difficulty: '쉬움'
      },
      {
        id: '5',
        name: '파스타',
        ingredients: ['파스타면', '토마토소스', '양파', '마늘'],
        time: '20분',
        difficulty: '보통'
      }
    ];

    return allRecipes.filter(recipe =>
      recipe.ingredients.some(ing => 
        ingredientNames.some(name => name.includes(ing) || ing.includes(name))
      )
    );
  };

  const expiringSoon = ingredients.filter(i => {
    const days = getDaysUntilExpiration(i.expirationDate);
    return days >= 0 && days <= 3;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Fridge-to-Table
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              냉장고 속 식재료를 효율적으로 관리하고 맛있는 요리를 만들어보세요
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setShowPremium(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
            >
              Pro 업그레이드
            </button>
          </div>
        </header>

        {expiringSoon.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
            <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
              유통기한 임박 ({expiringSoon.length}개)
            </h3>
            <div className="flex flex-wrap gap-2">
              {expiringSoon.map(item => (
                <span key={item.id} className="text-sm text-orange-700 dark:text-orange-400">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  냉장고 식재료 ({ingredients.length})
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + 추가
                </button>
              </div>

              {ingredients.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-4xl mb-4">🧊</p>
                  <p>냉장고가 비어있어요</p>
                  <p className="text-sm mt-2">식재료를 추가해주세요</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ingredients.map(ingredient => {
                    const days = getDaysUntilExpiration(ingredient.expirationDate);
                    const status = getExpirationStatus(days);
                    return (
                      <div
                        key={ingredient.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${status.color}`} />
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {ingredient.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {ingredient.category} • {ingredient.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-medium ${
                            days < 0 ? 'text-red-600 dark:text-red-400' :
                            days <= 3 ? 'text-orange-600 dark:text-orange-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {status.text}
                          </span>
                          <button
                            onClick={() => setEditingIngredient(ingredient)}
                            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteIngredient(ingredient.id)}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                추천 요리
              </h2>
              {ingredients.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-3xl mb-2">🍽️</p>
                  <p className="text-sm">식재료를 추가하면</p>
                  <p className="text-sm">추천 요리를 보여드려요</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getRecommendedRecipes().map(recipe => (
                    <div
                      key={recipe.id}
                      className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                        {recipe.name}
                      </h3>
                      <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>⏱️ {recipe.time}</span>
                        <span>•</span>
                        <span>📊 {recipe.difficulty}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {recipe.ingredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {getRecommendedRecipes().length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      현재 재료로 만들 수 있는 요리가 없어요
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                식재료 추가
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    식재료 이름
                  </label>
                  <input
                    type="text"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                    placeholder="예: 김치, 계란, 양파"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    카테고리
                  </label>
                  <select
                    value={newIngredient.category}
                    onChange={(e) => setNewIngredient({...newIngredient, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                  >
                    <option value="vegetable">채소</option>
                    <option value="meat">고기</option>
                    <option value="seafood">해산물</option>
                    <option value="dairy">유제품</option>
                    <option value="fruit">과일</option>
                    <option value="grain">곡물</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    유통기한
                  </label>
                  <input
                    type="date"
                    value={newIngredient.expirationDate}
                    onChange={(e) => setNewIngredient({...newIngredient, expirationDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    수량
                  </label>
                  <input
                    type="text"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                    placeholder="예: 1개, 500g"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={addIngredient}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}

        {editingIngredient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                식재료 수정
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    식재료 이름
                  </label>
                  <input
                    type="text"
                    value={editingIngredient.name}
                    onChange={(e) => setEditingIngredient({...editingIngredient, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    카테고리
                  </label>
                  <select
                    value={editingIngredient.category}
                    onChange={(e) => setEditingIngredient({...editingIngredient, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                  >
                    <option value="vegetable">채소</option>
                    <option value="meat">고기</option>
                    <option value="seafood">해산물</option>
                    <option value="dairy">유제품</option>
                    <option value="fruit">과일</option>
                    <option value="grain">곡물</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    유통기한
                  </label>
                  <input
                    type="date"
                    value={editingIngredient.expirationDate}
                    onChange={(e) => setEditingIngredient({...editingIngredient, expirationDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    수량
                  </label>
                  <input
                    type="text"
                    value={editingIngredient.quantity}
                    onChange={(e) => setEditingIngredient({...editingIngredient, quantity: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingIngredient(null)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={updateIngredient}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  수정
                </button>
              </div>
            </div>
          </div>
        )}

        {showPremium && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Pro 업그레이드
                </h3>
                <button
                  onClick={() => setShowPremium(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    무료 버전
                  </h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>✅ 식재료 관리</li>
                    <li>✅ 유통기한 알림</li>
                    <li>✅ 기본 요리 추천</li>
                    <li>❌ 광고 표시</li>
                    <li>❌ AI 식단 생성</li>
                    <li>❌ 영수증 스캔</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-2xl font-bold">Pro 버전</h4>
                    <span className="text-3xl font-bold">₩9,900/월</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li>✅ 모든 무료 기능</li>
                    <li>✅ 광고 제거</li>
                    <li>✅ AI 맞춤 주간 식단표</li>
                    <li>✅ 스마트 영수증 스캔</li>
                    <li>✅ 고급 요리 추천</li>
                    <li>✅ 영양소 분석</li>
                  </ul>
                  <button className="w-full py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                    지금 시작하기
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <h5 className="font-semibold text-gray-800 dark:text-white mb-2">
                      AI 식단 생성
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      냉장고 재료로 맞춤형 주간 식단을 AI가 자동 생성
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <h5 className="font-semibold text-gray-800 dark:text-white mb-2">
                      영수증 스캔
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      영수증 사진을 찍으면 식재료 자동 등록
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
