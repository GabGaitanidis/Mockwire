import type { FC } from "react";
import DashboardHeader from "../modules/dashboard/components/DashboardHeader";
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
    formData,
    statusCodeInput,
    selectedRuleId,
    generatedUrl,
    user,
    error,
    message,
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
    handleAddStatusCode,
    handleRemoveStatusCode,
    applyStatusCodePreset,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto px-4">
        <DashboardHeader
          isAuthenticated={Boolean(user)}
          onLogout={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("apiKey");
            window.location.reload();
          }}
        />

        <div className="container mx-auto px-4 py-8">
          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {user ? (
            <div>
              <UserProjectPanel
                user={user}
                projects={projects}
                activeProjectId={activeProjectId}
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
                  testResponse={testResponse}
                  testLoading={testLoading}
                  onSelectRule={setSelectedRuleId}
                  onGenerateUrl={handleGenerateUrl}
                  onTestUrl={handleTestUrl}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RulesListCard
                  rules={rules}
                  editingRuleId={editingRuleId}
                  onSetEditingRuleId={setEditingRuleId}
                  onDeleteRule={handleDeleteRule}
                  onUpdateRule={handleUpdateRule}
                />
                <UrlsListCard urls={urls} onDeleteUrl={handleDeleteUrl} />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-4">
                Please log in to access the dashboard.
              </p>
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-semibold"
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
