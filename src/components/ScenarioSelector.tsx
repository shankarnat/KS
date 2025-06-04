import React from 'react';
import type { Scenario } from '../types';
import { diabetesScenario } from '../scenarios/diabetesFlow';
import { multiDomainScenario } from '../scenarios/multiDomainFlow';

interface ScenarioSelectorProps {
  onSelectScenario: (scenario: Scenario) => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onSelectScenario }) => {
  const scenarios = [diabetesScenario, multiDomainScenario];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Knowledge Spaces Healthcare Assistant v2
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your consultation scenario to get started with specialized workflows and knowledge resources
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-blue-300"
            >
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {scenario.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {scenario.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-gray-700">
                    <div className="font-medium mb-2">Includes:</div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>{scenario.initialPersonalSpaces.length} Personal spaces</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>{scenario.initialOrgSpaces.length} Organization spaces</span>
                      </div>
                      {scenario.specializedSpaces && (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>{scenario.specializedSpaces.length} Specialized spaces</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 group-hover:bg-blue-700">
                      Start {scenario.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Need a different setup? You can customize knowledge spaces once you start a consultation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelector;