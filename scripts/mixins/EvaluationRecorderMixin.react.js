var EvaluationRecorderMixin = {
  handleTextChange: function(e) {
      this.state.evaluation.blurbs[e.target.id + ''] = e.target.value;
  },
  handleGradeChange: function(e) {
      this.state.evaluation.grades[e.target.id + ''] = e.target.value;
  }
}
module.exports = EvaluationRecorderMixin;
