import type { FC } from "react";
import DashboardHeader from "../modules/dashboard/components/DashboardHeader";
import ConditionSetsCard from "../modules/dashboard/components/ConditionSetsCard";
import RuleBuilderCard from "../modules/dashboard/components/RuleBuilderCard";
import RulesListCard from "../modules/dashboard/components/RulesListCard";
import TestApiCard from "../modules/dashboard/components/TestApiCard";
import UrlsListCard from "../modules/dashboard/components/UrlsListCard";
import UserProjectPanel from "../modules/dashboard/components/UserProjectPanel";
import { useDashboard } from "../modules/dashboard/hooks";

const Dashboard: FC = () => {
  const {
    projects,
    activeProjectId,
    rules,
    urls,
    conditionSets,
    formData,
    statusCodeInput,
    selectedRuleId,
    generatedUrl,
    testUrlInput,
    user,
    projectFeedback,
    ruleFeedback,
    urlFeedback,
    conditionFeedback,
    testResponse,
    testLoading,
    editingRuleId,
    setEditingRuleId,
    fieldNameInput,
    fieldTypeInput,
    fieldTypeOptions,
    schemaEntries,
    setFieldNameInput,
    setFieldTypeInput,
    setStatusCodeInput,
    setSelectedRuleId,
    setTestUrlInput,
    handleChange,
    handleAddSchemaField,
    handleRemoveSchemaField,
    applySchemaTemplate,
    handleSelectProject,
    handleCreateProject,
    handleSubmitRule,
    handleGenerateUrl,
    handleTestUrl,
    handleDeleteRule,
    handleUpdateRule,
    handleDeleteUrl,
    handleCreateConditionSet,
    handleUpdateConditionSet,
    handleDeleteConditionSet,
    handleAddStatusCode,
    handleRemoveStatusCode,
    applyStatusCodePreset,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto px-4">
        <DashboardHeader />

        <div className="container mx-auto px-4 py-8">
          {user ? (
            <div>
              <UserProjectPanel
                user={user}
                projects={projects}
                activeProjectId={activeProjectId}
                feedback={projectFeedback}
                onSelectProject={handleSelectProject}
                onCreateProject={handleCreateProject}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <RuleBuilderCard
                  formData={formData}
                  statusCodeInput={statusCodeInput}
                  fieldNameInput={fieldNameInput}
                  fieldTypeInput={fieldTypeInput}
                  fieldTypeOptions={fieldTypeOptions}
                  schemaEntries={schemaEntries}
                  feedback={ruleFeedback}
                  onChange={handleChange}
                  onSetFieldNameInput={setFieldNameInput}
                  onSetFieldTypeInput={setFieldTypeInput}
                  onSetStatusCodeInput={setStatusCodeInput}
                  onAddSchemaField={handleAddSchemaField}
                  onRemoveSchemaField={handleRemoveSchemaField}
                  onApplySchemaTemplate={applySchemaTemplate}
                  onAddStatusCode={handleAddStatusCode}
                  onRemoveStatusCode={handleRemoveStatusCode}
                  onApplyStatusCodePreset={applyStatusCodePreset}
                  onSubmitRule={handleSubmitRule}
                />

                <TestApiCard
                  rules={rules}
                  selectedRuleId={selectedRuleId}
                  generatedUrl={generatedUrl}
                  testUrlInput={testUrlInput}
                  testResponse={testResponse}
                  testLoading={testLoading}
                  feedback={urlFeedback}
                  onSelectRule={setSelectedRuleId}
                  onChangeTestUrlInput={setTestUrlInput}
                  onGenerateUrl={handleGenerateUrl}
                  onTestUrl={handleTestUrl}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RulesListCard
                  rules={rules}
                  editingRuleId={editingRuleId}
                  feedback={ruleFeedback}
                  onSetEditingRuleId={setEditingRuleId}
                  onDeleteRule={handleDeleteRule}
                  onUpdateRule={handleUpdateRule}
                />
                <UrlsListCard
                  urls={urls}
                  feedback={urlFeedback}
                  onDeleteUrl={handleDeleteUrl}
                />
              </div>

              <ConditionSetsCard
                activeProjectId={activeProjectId}
                conditionSets={conditionSets}
                feedback={conditionFeedback}
                onCreateConditionSet={handleCreateConditionSet}
                onUpdateConditionSet={handleUpdateConditionSet}
                onDeleteConditionSet={handleDeleteConditionSet}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#8b949e] mb-4">
                Please log in to access the dashboard.
              </p>
              <a
                href="/login"
                className="text-[#58a6ff] hover:text-[#79c0ff] font-semibold"
              >
                Go to Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
